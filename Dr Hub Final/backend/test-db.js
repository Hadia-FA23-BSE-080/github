const mysql = require('mysql2/promise');

async function testPassword(password) {
  try {
    const conn = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: password
    });
    console.log(`Success with password: "${password}"`);
    process.exit(0);
  } catch (err) {
    console.log(`Failed with password: "${password}"`);
  }
}

async function run() {
  const passwords = ['', 'root', 'admin', 'password', '1234', '12345', '123456', '12345678', 'qwerty'];
  for (const p of passwords) {
    await testPassword(p);
  }
  process.exit(1);
}
run();
