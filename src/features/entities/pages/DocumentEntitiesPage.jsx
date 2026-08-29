import { useOutletContext } from 'react-router-dom';
import { Tags } from 'lucide-react';
import { Badge, Button, Card, CardBody, CardHeader, Spinner } from '@components/ui';
import { formatDate } from '@lib/format';
import { useToast } from '@features/toast/useToast';
import { useExtractEntitiesMutation, useGetEntitiesQuery } from '../entitiesApi';

const DocumentEntitiesPage = () => {
  const { document } = useOutletContext();
  const toast = useToast();

  const { data: entitySet, isFetching } = useGetEntitiesQuery(document.id);
  const [extractEntities, { isLoading: isExtracting }] = useExtractEntitiesMutation();

  const handleExtract = async () => {
    const result = await extractEntities(document.id);
    if (result.error) return toast.error(result.error.message);
    return toast.success(`${result.data.totalFound} entities extracted.`);
  };

  const groups = Object.entries(entitySet?.entities?.entities_by_type ?? {});

  return (
    <div className="container-page flex flex-col gap-6 py-8">
      <Card>
        <CardHeader title="Extraction" description="Named entities via spaCy, key phrases via KeyBERT." />
        <div className="flex flex-col gap-3 border-t border-line p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <p className="text-xs text-slate-500">
            {entitySet ? `${entitySet.totalFound} entities · ${entitySet.keywords.length} key phrases · updated ${formatDate(entitySet.updatedAt)}` : 'Nothing extracted yet.'}
          </p>
          <Button onClick={handleExtract} isLoading={isExtracting} leftIcon={<Tags className="size-4" />} fullWidth className="sm:w-auto">
            {entitySet ? 'Re-extract' : 'Extract entities'}
          </Button>
        </div>
      </Card>

      {isFetching && !entitySet ? (
        <Card>
          <CardBody className="flex justify-center py-12">
            <Spinner size="lg" className="text-brand-600" />
          </CardBody>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader title="Named entities" description={entitySet ? `${groups.length} groups` : 'Grouped by type'} />
            <CardBody>
              {!entitySet ? (
                <p className="text-sm text-slate-400">Nothing extracted yet.</p>
              ) : groups.length === 0 ? (
                <p className="text-sm text-slate-400">No named entities found in this document.</p>
              ) : (
                <ul className="flex flex-col gap-4">
                  {groups.map(([group, items]) => (
                    <li key={group}>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{group}</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {items.map((item) => (
                          <Badge key={`${group}-${item.name}`} tone="brand" className="max-w-full break-words">
                            {item.name}
                            {item.count > 1 ? <span className="ml-1 text-brand-500">×{item.count}</span> : null}
                          </Badge>
                        ))}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Key phrases" description={entitySet ? `${entitySet.keywords.length} ranked` : 'Ranked by relevance'} />
            <CardBody>
              {!entitySet ? (
                <p className="text-sm text-slate-400">Nothing extracted yet.</p>
              ) : (
                <ul className="flex flex-col gap-2">
                  {entitySet.keywords.map((keyword) => (
                    <li key={keyword.keyword} className="flex items-center gap-3">
                      <span className="min-w-0 flex-1 truncate text-sm text-slate-700">{keyword.keyword}</span>
                      <span className="hidden h-1.5 w-16 shrink-0 overflow-hidden rounded-full bg-slate-100 sm:block sm:w-24">
                        <span className="block h-full rounded-full bg-brand-500" style={{ width: `${Math.round(keyword.score * 100)}%` }} />
                      </span>
                      <span className="w-9 shrink-0 text-right text-xs tabular-nums text-slate-500">{keyword.score.toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DocumentEntitiesPage;
