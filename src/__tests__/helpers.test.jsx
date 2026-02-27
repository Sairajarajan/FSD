import { formatSalary, uniqueValues } from "../utils/helpers";

describe("helpers", () => {
  test("formatSalary returns range text", () => {
    expect(formatSalary(50000, 70000)).toBe("$50,000 - $70,000");
  });

  test("uniqueValues returns deduplicated values", () => {
    const values = uniqueValues(
      [
        { location: "Remote" },
        { location: "Austin" },
        { location: "Remote" },
      ],
      "location"
    );

    expect(values).toEqual(["Remote", "Austin"]);
  });
});
