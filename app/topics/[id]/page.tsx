import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { TOPICS, TOPIC_MAP } from "@/content/topics";
import TopicView from "./TopicView";

export const dynamicParams = false;
export function generateStaticParams() {
  return TOPICS.map((t) => ({ id: t.id }));
}
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return { title: TOPIC_MAP[id]?.title || "Topic" };
}
export default async function TopicPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!TOPIC_MAP[id]) notFound();
  return <TopicView id={id} />;
}
