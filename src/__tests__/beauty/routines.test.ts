import { describe, it } from "vitest";

describe("Routine Server Actions", () => {
  describe("getRoutinesWithSteps", () => {
    it.todo("returns Morning and Evening routines with steps");
    it.todo("returns signed thumbnail URLs for step products");
    it.todo("steps are ordered by stepOrder");
    it.todo("throws Unauthorized when not authenticated");
  });
  describe("addRoutineStep", () => {
    it.todo("adds product as next step in routine");
    it.todo("calculates correct stepOrder");
    it.todo("throws Unauthorized when not authenticated");
  });
  describe("removeRoutineStep", () => {
    it.todo("removes step from routine");
    it.todo("throws Unauthorized when not authenticated");
  });
  describe("reorderRoutineSteps", () => {
    it.todo("updates stepOrder for all steps");
    it.todo("persists new order to database");
    it.todo("throws Unauthorized when not authenticated");
  });
});
