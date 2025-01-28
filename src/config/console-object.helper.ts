export class Csole {
  static show(obj: any) {
    console.log(`=== Inspecting ${JSON.stringify(obj)}===`);
    console.log(`Properties for :`);
    console.log(Object.keys(obj)); // Own properties
    console.log("\nPrototype Methods:");
    console.log(Object.getOwnPropertyNames(Object.getPrototypeOf(obj))); // Methods on prototype
  }
}
