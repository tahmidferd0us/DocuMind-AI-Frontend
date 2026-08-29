import { useEffect, useRef, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { SendHorizonal, Trash2 } from 'lucide-react';
import { Button, Card, CardBody, CardHeader, Input, Spinner } from '@components/ui';
import { formatDate } from '@lib/format';
import { useToast } from '@features/toast/useToast';
import { useAskQuestionMutation, useClearConversationMutation, useGetConversationQuery } from '../qaApi';

const SourceList = ({ sources }) => {
  if (!sources?.length) return null;
  const pages = [...new Set(sources.map((source) => source.page))];

  return (
    <div className="mt-3 border-t border-line pt-3">
      <p className="text-xs font-medium text-slate-500">
        Grounded in page{pages.length > 1 ? 's' : ''} {pages.join(', ')}
      </p>
      <ul className="mt-2 flex flex-col gap-2">
        {sources.slice(0, 2).map((source, index) => (
          <li key={source.chunk_id ?? index} className="rounded-md bg-surface-muted px-3 py-2">
            <p className="text-xs leading-relaxed text-slate-600">
              <span className="font-medium text-slate-700">Page {source.page}:</span> {source.snippet}
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
    <div className="max-w-[92%] rounded-xl rounded-bl-sm border border-line bg-white px-4 py-3">
      <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">{message.answer}</p>
      <SourceList sources={message.sources} />
      <p className="mt-2 text-[11px] text-slate-400">
        {message.model} · {formatDate(message.createdAt)}
      </p>
    </div>
  </li>
);

const DocumentAskPage = () => {
  const { document } = useOutletContext();
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
      toast.error(result.error.message);
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
            <p className="py-12 text-center text-sm text-slate-400">No questions asked about this document yet.</p>
          ) : (
            <ul className="flex flex-col gap-6">
              {messages.map((message) => (
                <Exchange key={message.id} message={message} />
              ))}
            </ul>
          )}

          {isAsking ? (
            <div className="mt-6 flex items-center gap-2 text-sm text-slate-500">
              <Spinner size="sm" className="text-brand-600" />
              Retrieving passages and writing an answer…
            </div>
          ) : null}

          <div ref={endRef} />
        </CardBody>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 border-t border-line p-4 sm:flex-row sm:p-6">
          <Input
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="e.g. What file types must the platform support?"
            disabled={isAsking}
            containerClassName="flex-1"
          />
          <Button type="submit" isLoading={isAsking} leftIcon={<SendHorizonal className="size-4" />} className="sm:self-start">
            Ask
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default DocumentAskPage;
