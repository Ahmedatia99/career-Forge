// // Utility to parse comma-separated skills into individual skills
// export function parseSkills(skillsInput: string | string[]): string[] {
//   if (Array.isArray(skillsInput)) {
//     // If already an array, flatten any comma-separated values
//     return skillsInput.flatMap((skill) =>
//       skill
//         .split(",")
//         .map((s) => s.trim())
//         .filter((s) => s.length > 0),
//     )
//   }

//   // If string, split by comma
//   return skillsInput
//     .split(",")
//     .map((skill) => skill.trim())
//     .filter((skill) => skill.length > 0)
// }
