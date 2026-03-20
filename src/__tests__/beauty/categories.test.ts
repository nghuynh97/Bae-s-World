import { describe, it } from "vitest";

describe("Beauty Category Server Actions", () => {
  describe("getBeautyCategories", () => {
    it.todo("returns categories ordered by displayOrder");
    it.todo("throws Unauthorized when not authenticated");
  });
  describe("createBeautyCategory", () => {
    it.todo("creates category with generated slug");
    it.todo("throws Unauthorized when not authenticated");
    it.todo("validates name length 1-50");
  });
  describe("updateBeautyCategory", () => {
    it.todo("updates category name and regenerates slug");
    it.todo("throws Unauthorized when not authenticated");
  });
  describe("deleteBeautyCategory", () => {
    it.todo("deletes category when no products reference it");
    it.todo("throws when products reference category");
    it.todo("throws when trying to delete default category");
    it.todo("throws Unauthorized when not authenticated");
  });
});
