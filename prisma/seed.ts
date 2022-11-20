import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const newTodo = await prisma.todo.upsert({
    where: { id: "1" },
    update: {},
    create: {
      task: "Buy a new PC",
      isDone: false,
      dueDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
  console.log({ newTodo });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
