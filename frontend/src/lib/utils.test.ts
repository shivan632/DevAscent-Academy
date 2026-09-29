import { getEmbedUrl } from './utils';
import assert from 'assert';

console.log('Running 7 unit tests for getEmbedUrl()...\n');

const testCases = [
  {
    name: '1. Standard YouTube watch URL',
    input: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    expected: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  },
  {
    name: '2. YouTube watch URL with timestamp',
    input: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=45s',
    expected: 'https://www.youtube.com/embed/dQw4w9WgXcQ?start=45',
  },
  {
    name: '3. Shortened youtu.be URL',
    input: 'https://youtu.be/dQw4w9WgXcQ',
    expected: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  },
  {
    name: '4. Already YouTube embed URL (pass-through)',
    input: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    expected: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  },
  {
    name: '5. YouTube Shorts URL',
    input: 'https://www.youtube.com/shorts/dQw4w9WgXcQ',
    expected: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  },
  {
    name: '6. YouTube watch URL with playlist query (list dropped)',
    input: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=PLr6-S54ZwOD6vVn8aWb6',
    expected: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  },
  {
    name: '7. Non-YouTube / Cloudinary / Custom URL (pass-through)',
    input: 'https://res.cloudinary.com/demo/video/upload/sample.mp4',
    expected: 'https://res.cloudinary.com/demo/video/upload/sample.mp4',
  },
];

let passed = 0;
for (const tc of testCases) {
  const result = getEmbedUrl(tc.input);
  try {
    assert.strictEqual(result, tc.expected);
    console.log(`✅ Passed: ${tc.name}`);
    passed++;
  } catch (err) {
    console.error(`❌ Failed: ${tc.name}`);
    console.error(`   Input:    ${tc.input}`);
    console.error(`   Expected: ${tc.expected}`);
    console.error(`   Actual:   ${result}`);
  }
}

console.log(`\nResults: ${passed}/${testCases.length} tests passed.`);
if (passed !== testCases.length) {
  process.exit(1);
}
