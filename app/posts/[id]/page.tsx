import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

async function getPost(id: string) {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  return res.json();
}

export default async function PostPage({ params }: { params: { id: string } }) {
  const post = await getPost(params.id);

  return (
    <div className="container py-10">
      <Card>
        <CardHeader>
          <CardTitle>{post.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{post.body}</p>
        </CardContent>
      </Card>
    </div>
  );
}