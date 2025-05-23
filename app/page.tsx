import DocLayout from '@/components/doc-layout';
import { getDocContent } from '@/lib/docs';

export default async function Home() {
  const content = await getDocContent('vmware-setup');
  
  return (
    <DocLayout content={content} />
  );
}