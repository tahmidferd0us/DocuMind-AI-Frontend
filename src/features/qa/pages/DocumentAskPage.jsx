import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useOutletContext } from 'react-router-dom';
import { SendHorizonal, Trash2 } from 'lucide-react';
import { Button, Card, CardBody, CardHeader, Input, Spinner } from '@components/ui';
import { formatDate } from '@lib/format';
import { useToast } from '@features/toast/useToast';
import { openUpgradeModal } from '@features/subscriptions/subscriptionsSlice';
import { useAskQuestionMutation, useClearConversationMutation, useGetConversationQuery } from '../qaApi';

const SourceList = ({ sources }) => {
  if (!sources?.length) return null;
  const pages = [...new Set(sources.map((source) => source.page))];

  return (
    <div className="mt-3 border-t border-line pt-3">
      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
        Grounded in page{pages.length > 1 ? 's' : ''} {pages.join(', ')}
      </p>
      <ul className="mt-2 flex flex-col gap-2">
        {sources.slice(0, 2).map((source, index) => (
          <li key={source.chunk_id ?? index} className="rounded-md bg-surface-muted px-3 py-2">
            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              <span className="font-medium text-slate-700 dark:text-slate-100">Page {source.page}:</span> {source.snippet}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Exchange = ({ message }) => (
  <li className="flex flex-col gap-2">
    <div className="max-w-[85%] self-end rounded-xl rounded-br-sm bg-brand-600 px-4 py-2.5 text-sm text-white">{message.question}</div>
    <div className="max-w-[92%] rounded-xl rounded-bl-sm border border-line bg-white dark:bg-slate-900 dark:border-slate-800 px-4 py-3">
      <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700 dark:text-slate-200">{message.answer}</p>
      <SourceList sources={message.sources} />
      <p className="mt-2 text-[11px] text-slate-400 dark:text-slate-400">
        {message.model} · {formatDate(message.createdAt)}
      </p>
    </div>
  </li>
);

const DocumentAskPage = () => {
  const { document } = useOutletContext();
  const dispatch = useDispatch();
  const toast = useToast();
  const endRef = useRef(null);
  const [question, setQuestion] = useState('');

  const { data: messages = [], isFetching } = useGetConversationQuery(document.id);
  const [askQuestion, { isLoading: isAsking }] = useAskQuestionMutation();
  const [clearConversation, { isLoading: isClearing }] = useClearConversationMutation();

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages.length, isAsking]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmed = question.trim();
    if (trimmed.length < 3) return toast.error('Ask a question of at least 3 characters.');

    setQuestion('');
    const result = await askQuestion({ documentId: document.id, question: trimmed });
    if (result.error) {
      setQuestion(trimmed);
      if (result.error.status === 402 || result.error.code === 'QUOTA_EXCEEDED') {
        dispatch(
          openUpgradeModal({
            reason: 'QUOTA_EXCEEDED',
            message: result.error.message || 'You have reached your monthly Q&A question limit. Please upgrade to Pro for higher limits.',
          }),
        );
      } else {
        toast.error(result.error.message);
      }
    }
    return undefined;
  };

  const handleClear = async () => {
    const result = await clearConversation(document.id);
    if (result.error) toast.error(result.error.message);
    else toast.success('Conversation cleared.');
  };

  return (
    <div className="container-page flex flex-col gap-6 py-8">
      <Card className="flex flex-col">
        <CardHeader
          title="Conversation"
          description="The first question indexes the document, so it may take a few seconds."
          action={
            <Button variant="outline" size="sm" onClick={handleClear} isLoading={isClearing} disabled={!messages.length} leftIcon={<Trash2 className="size-4" />}>
              Clear
            </Button>
          }
        />

        <CardBody className="min-h-[18rem]">
          {isFetching && !messages.length ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" className="text-brand-600" />
            </div>
          ) : messages.length === 0 ? (
            <p className="py-12 text-center text-sm text-slate-400 dark:text-slate-400">No questions asked about this document yet.</p>
          ) : (
            <ul className="flex flex-col gap-6">
              {messages.map((message) => (
                <Exchange key={message.id} message={message} />
              ))}
              <div ref={endRef} />
            </ul>
          )}
        </CardBody>

        <form onSubmit={handleSubmit} className="border-t border-line p-4 sm:p-6">
          <div className="flex gap-2">
            <Input
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Ask anything about this document…"
              disabled={isAsking}
              className="flex-1"
            />
            <Button type="submit" isLoading={isAsking} disabled={!question.trim()} rightIcon={<SendHorizonal className="size-4" />}>
              Ask
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default DocumentAskPage;
