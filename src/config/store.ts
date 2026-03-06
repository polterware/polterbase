import Conf from "conf";
import type { Pipeline } from "../data/types.js";

const config = new Conf({
  projectName:
    process.env.NODE_ENV === "test" ? "polter-test" : "polter",
});

const GLOBAL_PIPELINES_KEY = "globalPipelinesV1";

export function getGlobalPipelines(): Pipeline[] {
  if (!config.has(GLOBAL_PIPELINES_KEY)) {
    config.set(GLOBAL_PIPELINES_KEY, []);
  }
  return (config.get(GLOBAL_PIPELINES_KEY) as Pipeline[]) || [];
}

export function saveGlobalPipeline(pipeline: Pipeline): void {
  const pipelines = getGlobalPipelines();
  const idx = pipelines.findIndex((p) => p.id === pipeline.id);
  if (idx >= 0) {
    pipelines[idx] = pipeline;
  } else {
    pipelines.push(pipeline);
  }
  config.set(GLOBAL_PIPELINES_KEY, pipelines);
}

export function deleteGlobalPipeline(pipelineId: string): void {
  const pipelines = getGlobalPipelines().filter((p) => p.id !== pipelineId);
  config.set(GLOBAL_PIPELINES_KEY, pipelines);
}

export function __clearGlobalPipelinesForTests(): void {
  config.set(GLOBAL_PIPELINES_KEY, []);
}
