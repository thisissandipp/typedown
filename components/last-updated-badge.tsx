import { formatLastUpdatedTimestamp } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Clock8 } from 'lucide-react';
import React from 'react';

export function LastUpdatedBadge({ lastUpdatedAt }: { lastUpdatedAt: Date }) {
  const [lastUpdatedText, setLastUpdatedText] = React.useState('');

  React.useEffect(() => {
    setLastUpdatedText(formatLastUpdatedTimestamp(lastUpdatedAt));

    const intervalId = setInterval(() => {
      setLastUpdatedText(formatLastUpdatedTimestamp(lastUpdatedAt));
    }, 300000);

    return () => clearInterval(intervalId);
  }, [lastUpdatedAt]);

  return (
    <Badge variant="outline" className="ml-2.5">
      <Clock8 />
      {lastUpdatedText}
    </Badge>
  );
}
