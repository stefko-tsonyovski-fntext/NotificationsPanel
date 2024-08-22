"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@radix-ui/react-dialog";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@radix-ui/react-select";
import { z, ZodError } from "zod";
import { useForm } from "react-hook-form";
import { trpc } from "@/server/client";

const notificationTypes = [
  { value: "PLATFORM_UPDATE", label: "Platform update" },
  { value: "COMMENT_TAG", label: "Comment Tag" },
  { value: "ACCESS_GRANTED", label: "Access granted" },
  { value: "JOIN_WORKSPACE", label: "Join workspace" },
];

const notificationSchema = z.object({
  type: z.string().min(1),
  message: z.string().min(1),
  releaseNumber: z.string().optional(),
  personName: z.string().optional(),
});

type NotificationFormValues = z.infer<typeof notificationSchema>;

const CreateNotificationModal = () => {
  // General hooks
  const utils = trpc.useUtils();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NotificationFormValues>({
    defaultValues: {
      type: "",
      message: "",
      releaseNumber: "",
      personName: "",
    },
  });

  // State
  const [selectedType, setSelectedType] = useState<string>("");

  // Mutations
  const mutation = trpc.notifications.addNotification.useMutation({
    onSuccess: () => {
      reset();
    },
  });

  const onSubmit = (data: NotificationFormValues) => {
    mutation.mutate({
      type: data.type,
      message: data.message,
      releaseNumber:
        data.type === "PLATFORM_UPDATE" ? data.releaseNumber || "" : undefined,
      personName:
        data.type !== "PLATFORM_UPDATE" ? data.personName || "" : undefined,
    });
  };

  return (
    // <Dialog>
    //   <DialogTrigger asChild>
    //     <button className="px-4 py-2 bg-green-500 text-white rounded-md">
    //       Add Notification
    //     </button>
    //   </DialogTrigger>
    //   <DialogContent className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
    //     <div className="bg-white p-6 rounded-lg w-full max-w-md">
    //       <DialogTitle className="text-lg font-semibold">
    //         Create Notification
    //       </DialogTitle>
    //       <DialogClose className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
    //         <button>✕</button>
    //       </DialogClose>
    //       <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
    //         <div className="mb-4">
    //           <label className="block text-sm font-medium text-gray-700">
    //             Notification Type
    //           </label>
    //           <Select
    //             onValueChange={setSelectedType}
    //             defaultValue=""
    //             className="mt-2 block w-full"
    //             {...register("type")}
    //           >
    //             <SelectTrigger>
    //               <span>Select type</span>
    //             </SelectTrigger>
    //             <SelectContent>
    //               {notificationTypes.map((type) => (
    //                 <SelectItem key={type.value} value={type.value}>
    //                   {type.label}
    //                 </SelectItem>
    //               ))}
    //             </SelectContent>
    //           </Select>
    //           {errors.type && (
    //             <p className="text-red-500 text-xs mt-1">
    //               {errors.type.message}
    //             </p>
    //           )}
    //         </div>
    //         <div className="mb-4">
    //           <label className="block text-sm font-medium text-gray-700">
    //             Message
    //           </label>
    //           <textarea
    //             className="mt-2 block w-full border border-gray-300 rounded-md"
    //             rows={3}
    //             {...register("message")}
    //           />
    //           {errors.message && (
    //             <p className="text-red-500 text-xs mt-1">
    //               {errors.message.message}
    //             </p>
    //           )}
    //         </div>
    //         {selectedType === "Platform update" && (
    //           <div className="mb-4">
    //             <label className="block text-sm font-medium text-gray-700">
    //               Release Number
    //             </label>
    //             <input
    //               type="text"
    //               className="mt-2 block w-full border border-gray-300 rounded-md"
    //               {...register("releaseNumber")}
    //             />
    //           </div>
    //         )}
    //         {selectedType !== "Platform update" && (
    //           <div className="mb-4">
    //             <label className="block text-sm font-medium text-gray-700">
    //               Person Name
    //             </label>
    //             <input
    //               type="text"
    //               className="mt-2 block w-full border border-gray-300 rounded-md"
    //               {...register("personName")}
    //             />
    //           </div>
    //         )}
    //         <div className="flex justify-end">
    //           <button
    //             type="button"
    //             className="mr-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
    //             onClick={() => reset()}
    //           >
    //             Cancel
    //           </button>
    //           <button
    //             type="submit"
    //             className="px-4 py-2 bg-blue-500 text-white rounded-md"
    //             disabled={mutation.isPending}
    //           >
    //             {mutation.isPending ? "Creating..." : "Create"}
    //           </button>
    //         </div>
    //       </form>
    //     </div>
    //   </DialogContent>
    // </Dialog>
    <></>
  );
};

export default CreateNotificationModal;
