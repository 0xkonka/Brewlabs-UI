import Modal from "components/Modal";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { capitalize } from "lodash";

import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { IncrementorInput } from "@components/ui/incrementor-input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@components/ui/form";

import { useMarketplaceStore, setCreateModalOpen } from "state/marketplace.store";

import TokenLogo from "components/logo/TokenLogo";
import { getEmptyTokenLogo } from "utils/functions";
import getTokenLogoURL from "utils/getTokenLogoURL";

const CreateModal = () => {
  const [createModalOpen] = useMarketplaceStore("createModalOpen");
  // const [investmentBond] = useMarketplaceStore("investmentBond");

  const formSchema = z.object({
    investmentAmount: z.coerce.number().min(1).max(10).optional(),
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      investmentAmount: 0,
    },
  });

  return (
    <Modal
      open={createModalOpen}
      onClose={() => {
        setCreateModalOpen(false);
      }}
    >
      <div className="flex w-full flex-col gap-8 p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="my-16 space-y-12">
            <FormField
              control={form.control}
              name="investmentAmount"
              render={({ field }) => (
                <FormItem className="my-4 flex flex-col items-center gap-2">
                  <FormLabel>Enter investment amount in units</FormLabel>
                  <FormControl className="w-fit">
                    <div className="flex flex-col items-end">
                      <IncrementorInput step={1} min={1} max={10} symbol="%" {...field} />
                      <FormMessage />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            <Button type="submit" variant="brand" className="w-full">
              Create bond
            </Button>
          </form>
        </Form>
      </div>
    </Modal>
  );
};

export default CreateModal;
