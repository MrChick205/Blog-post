const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Setting up Prisma...\n');

// Check if .env exists
const envPath = path.join(__dirname, '..', '.env');
if (!fs.existsSync(envPath)) {
  console.error('❌ File .env not found!');
  console.log('📝 Please create .env file from env.template');
  process.exit(1);
}

// Check DATABASE_URL in .env
const envContent = fs.readFileSync(envPath, 'utf8');
if (!envContent.includes('DATABASE_URL=')) {
  console.error('❌ DATABASE_URL not found in .env file!');
  console.log('📝 Please add DATABASE_URL to your .env file');
  console.log('   Example: DATABASE_URL=postgresql://postgres:postgres@localhost:5432/blogpost');
  process.exit(1);
}

console.log('✅ .env file found with DATABASE_URL\n');

try {
  console.log('📦 Generating Prisma Client...');
  execSync('npx prisma generate', { 
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });
  console.log('✅ Prisma Client generated successfully!\n');
} catch (error) {
  console.error('❌ Error generating Prisma Client:', error.message);
  process.exit(1);
}

console.log('🎉 Prisma setup completed!');
console.log('\n📋 Next steps:');
console.log('   1. Make sure PostgreSQL is running: docker-compose up -d');
console.log('   2. Run migrations: npm run prisma:migrate');
console.log('   3. Start Prisma Studio: npm run prisma:studio');

