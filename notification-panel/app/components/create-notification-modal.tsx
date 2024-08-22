"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@radix-ui/react-dialog";
import * as Select from "@radix-ui/react-select";
import { z } from "zod";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { trpc } from "@/server/client";
import { Button } from "@radix-ui/themes";

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
    control,
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
    setValue,
  } = useForm<NotificationFormValues>({
    defaultValues: {
      type: "",
      message: "",
      releaseNumber: "",
      personName: "",
    },
  });

  // Other variables
  const selectedType = watch("type");

  // Mutations
  const mutation = trpc.notifications.addNotification.useMutation();

  const onSubmit = (data: NotificationFormValues) => {
    mutation.mutate(
      {
        type: data.type,
        message: data.message,
        releaseNumber:
          data.type === "PLATFORM_UPDATE"
            ? data.releaseNumber || ""
            : undefined,
        personName:
          data.type !== "PLATFORM_UPDATE" ? data.personName || "" : undefined,
      },
      {
        onSuccess: () => {
          utils.notifications.invalidate();
          reset();
        },
      }
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="px-4 py-2 bg-green-500 text-white rounded-md">
          Add Notification
        </button>
      </DialogTrigger>
      <DialogContent className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
        <div className="bg-white p-6 rounded-lg w-full max-w-md">
          <DialogTitle className="text-lg font-semibold">
            Create Notification
          </DialogTitle>
          <DialogClose className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
            <button>✕</button>
          </DialogClose>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label
                htmlFor="type"
                className="block text-sm font-medium text-gray-700"
              >
                Type
              </label>
              <Controller
                control={control}
                name="type"
                rules={{ required: "Notification type is required" }}
                render={({ field }) => (
                  <Select.Root
                    onValueChange={(value) => {
                      field.onChange(value);
                      setValue("releaseNumber", "");
                      setValue("personName", "");
                    }}
                    value={field.value || ""}
                    className="mt-2"
                  >
                    <Select.Trigger className="inline-flex items-center justify-between w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white">
                      <Select.Value placeholder="Select type" />
                      <Select.Icon />
                    </Select.Trigger>
                    <Select.Content className="bg-white border border-gray-300 rounded-md shadow-lg mt-1">
                      {notificationTypes.map(({ value, label }) => (
                        <Select.Item
                          key={value}
                          value={value}
                          className="cursor-pointer px-3 py-2 hover:bg-gray-100"
                        >
                          <Select.ItemText>{label}</Select.ItemText>
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                )}
              />
              {errors.type && (
                <p className="text-red-600 text-xs mt-1">
                  {errors.type.message}
                </p>
              )}
            </div>

            {selectedType === "PLATFORM_UPDATE" && (
              <div>
                <label
                  htmlFor="releaseNumber"
                  className="block text-sm font-medium text-gray-700"
                >
                  Release number
                </label>
                <input
                  id="releaseNumber"
                  type="text"
                  {...register("releaseNumber", {
                    required: selectedType === "PLATFORM_UPDATE",
                  })}
                  className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
                />
                {errors.releaseNumber && (
                  <p className="text-red-600 text-xs mt-1">
                    This field is required
                  </p>
                )}
              </div>
            )}

            {(selectedType === "COMMENT_TAG" ||
              selectedType === "ACCESS_GRANTED" ||
              selectedType === "JOIN_WORKSPACE") && (
              <div>
                <label
                  htmlFor="personName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Person name
                </label>
                <input
                  id="personName"
                  type="text"
                  {...register("personName", {
                    required: selectedType !== "PLATFORM_UPDATE",
                  })}
                  className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
                />
                {errors.personName && (
                  <p className="text-red-600 text-xs mt-1">
                    This field is required
                  </p>
                )}
              </div>
            )}

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700"
              >
                Message
              </label>
              <input
                id="message"
                type="text"
                {...register("message", { required: true })}
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
              />
              {errors.message && (
                <p className="text-red-600 text-xs mt-1">
                  This field is required
                </p>
              )}
            </div>

            <div className="flex justify-center gap-3">
              <DialogClose>
                <Button
                  onClick={reset}
                  className="px-4 py-2"
                  variant="soft"
                  color="gray"
                >
                  Close
                </Button>
              </DialogClose>

              <Button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Submit
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNotificationModal;
