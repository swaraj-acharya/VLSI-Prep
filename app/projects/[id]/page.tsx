import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { LEARNING_PROJECTS, LEARNING_MAP } from "@/content/projects";
import { FLAGSHIPS, FLAGSHIP_MAP } from "@/content/flagship";
import ProjectView from "./ProjectView";

export const dynamicParams = false;
export function generateStaticParams() {
  return [...LEARNING_PROJECTS, ...FLAGSHIPS].map((p) => ({ id: p.id }));
}
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return { title: (FLAGSHIP_MAP[id] || LEARNING_MAP[id])?.title || "Project" };
}
export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!FLAGSHIP_MAP[id] && !LEARNING_MAP[id]) notFound();
  return <ProjectView id={id} />;
}
