import { useState, ChangeEvent } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Upload } from "lucide-react";

import ChainSelect from "views/swap/components/ChainSelect";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { Textarea } from "@components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@components/ui/form";

import { tokenDeployerSchema } from "config/schemas/tokenDeployerSchema";
import { useDeployerState, setTokenInfo, setTokenImageDisplayUrl, setDeployerStep } from "state/deploy/deployer.store";

const DeployDetails = () => {
  const [tokenImageDisplayUrl] = useDeployerState("tokenImageDisplayUrl");

  const form = useForm<z.infer<typeof tokenDeployerSchema>>({
    resolver: zodResolver(tokenDeployerSchema),
    defaultValues: {
      tokenName: "",
      tokenSymbol: "",
      tokenDecimals: 18,
      tokenTotalSupply: 0,
      tokenImage: undefined,
      tokenDescription: "",
    },
  });

  const getImageData = (event: ChangeEvent<HTMLInputElement>) => {
    // FileList is immutable, so we need to create a new one
    const dataTransfer = new DataTransfer();
    // Add newly uploaded images
    Array.from(event.target.files!).forEach((image) => dataTransfer.items.add(image));

    const files = dataTransfer.files;
    const displayUrl = URL.createObjectURL(event.target.files![0]);

    return { files, displayUrl };
  };

  const onSubmit = (data: z.infer<typeof tokenDeployerSchema>) => {
    // Store the form data in deployer store
    setTokenInfo(data);
    // Progress to the confirm step
    setDeployerStep("confirm");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mb-8 space-y-4">
        <div className="my-8">
          <h4 className="mb-6 text-xl">Choose a network to deploy on</h4>
          <ChainSelect id="chain-select" />
        </div>

        <div className="divider" />

        <div className="my-8">
          <h4 className="mb-6 text-xl">Token details</h4>

          <div className="mb-4 grid gap-6 sm:grid-cols-2">
            <div className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="tokenName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Token name</FormLabel>
                    <FormControl>
                      <Input placeholder="ie: Brewlabs" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tokenSymbol"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Token symbol</FormLabel>
                    <FormControl>
                      <Input placeholder="ie: BNB" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tokenTotalSupply"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>How many tokens do you want to create?</FormLabel>
                    <FormControl>
                      <Input placeholder="ie: 100 000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="tokenDecimals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Token decimals</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tokenImage"
                render={({ field: { onChange, value, ...rest } }) => (
                  <FormItem className="relative">
                    <FormLabel>Token icon</FormLabel>
                    <div className="absolute left-0 top-6">
                      <Avatar className="ring ring-zinc-900">
                        <AvatarImage src={tokenImageDisplayUrl} width={500} height={500} alt="Token image" />
                        <AvatarFallback>
                          <Upload className="h-auto w-4" />
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <FormControl>
                      <Input
                        type="file"
                        className="pl-12"
                        {...rest}
                        onChange={(e) => {
                          const { files, displayUrl } = getImageData(e);
                          setTokenImageDisplayUrl(displayUrl);
                          onChange(files);
                        }}
                        accept="image/png, image/jpeg, image/webp, image/gif, image/svg+xml"
                      />
                    </FormControl>
                    <small className=" text-gray-400">Recommended size: 500x500px</small>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <FormField
            control={form.control}
            name="tokenDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Token description</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="divider" />

        <Button variant="brand" type="submit" className="w-full">
          Deploy token
        </Button>
      </form>
    </Form>
  );
};

export default DeployDetails;
