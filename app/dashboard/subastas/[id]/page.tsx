import { redirect } from 'next/navigation';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function SubastaDetailPage({ params }: Props) {
  const { id } = await params;
  redirect(`/subastas/${id}`);
}
