import fs from "fs";

const schema = JSON.parse(
  fs.readFileSync(new URL("../data/platforms.schema.json", import.meta.url)),
);

const data = JSON.parse(
  fs.readFileSync(new URL("../data/platforms.json", import.meta.url)),
);

let ok = true;

function validateItem(item) {
  const required = schema.required ?? [];

  for (const key of required) {
    if (!(key in item)) {
      console.error(`Missing required field: ${key} in ${item.name}`);
      return false;
    }
  }

  return true;
}

const seen = new Map();

for (const item of data) {
  if (!validateItem(item)) ok = false;

  const key = item.name.toLowerCase();

  if (seen.has(key)) {
    ok = false;
    console.error(
      `Duplicate: "${item.name}" already exists as "${seen.get(key)}"`,
    );
  } else {
    seen.set(key, item.name);
  }
}

for (let i = 2; i < data.length; i++) {
  const prev = data[i - 1].name.toLowerCase();
  const curr = data[i].name.toLowerCase();

  if (prev > curr) {
    ok = false;
    console.error(
      `Ordering issue: "${data[i].name}" should be before "${data[i - 1].name}"`,
    );
  }
}

if (!ok) process.exit(1);

console.log("Dataset valid ✔");
