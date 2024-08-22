// Import Prisma Client
import { PrismaClient } from "@prisma/client";

// Initialize Prisma Client
const prisma = new PrismaClient();

// Define the main function that will handle database operations
async function main() {
  // Define notification types for variety
  const types = [
    "PLATFORM_UPDATE",
    "COMMENT_TAG",
    "ACCESS_GRANTED",
    "JOIN_WORKSPACE",
  ];

  // Define some sample messages
  const messages = [
    "New features - see what’s new",
    "<Somebody> tagged you in a comment",
    "<Somebody> shared a chat with you",
    "<Somebody> joined your workspace",
  ];

  // Seed 34 notifications
  for (let i = 1; i <= 34; i++) {
    const type = types[i % types.length];
    const message = messages[i % messages.length];
    const read = i % 2 === 0; // Alternate between read and unread notifications
    const releaseNumber = "";
    const personName = "";
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - Math.floor(Math.random() * 30)); // Random date within the last 30 days

    const notification = await prisma.notification.create({
      data: {
        type,
        message,
        read,
        releaseNumber,
        personName,
        createdAt,
      },
    });

    console.log(
      `Created notification ${notification.id}: ${notification.message}`
    );
  }
}

// Execute the main function and handle disconnection and errors
main()
  .then(() => prisma.$disconnect()) // Disconnect from the database on successful completion
  .catch(async (e) => {
    console.error(e); // Log any errors
    await prisma.$disconnect(); // Ensure disconnection even if an error occurs
    process.exit(1); // Exit the process with an error code
  });
