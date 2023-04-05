import getTokenLogoURL from "utils/getTokenLogoURL";

const IndexLogo = ({ tokens }) => {
  switch (tokens.length) {
    case 2:
      return (
        <div className="mt-4 flex w-fit items-center md:w-[160px]">
          <img src={getTokenLogoURL(tokens[0].address, tokens[0].chainId)} alt={""} className="w-[70px] rounded-full" />
          <img
            src={getTokenLogoURL(tokens[1].address, tokens[1].chainId)}
            alt={""}
            className="-ml-3 w-[70px] rounded-full"
          />
        </div>
      );
    case 3:
      return (
        <div className="mt-4 w-fit items-center md:w-[160px]">
          <div className="flex justify-center">
            <img src={getTokenLogoURL(tokens[0].address, tokens[0].chainId)} alt={""} className="w-[60px] rounded-full" />
            <img
              src={getTokenLogoURL(tokens[1].address, tokens[1].chainId)}
              alt={""}
              className="-ml-3 w-[60px] rounded-full"
            />
          </div>
          <div className="-mt-3">
            <img
              src={getTokenLogoURL(tokens[2].address, tokens[2].chainId)}
              alt={""}
              className="m-auto w-[60px] rounded-full"
            />
          </div>
        </div>
      );
    case 4:
      return (
        <div className="mt-4 w-fit items-center md:w-[160px]">
          <div className="flex justify-center">
            <img src={getTokenLogoURL(tokens[0].address, tokens[0].chainId)} alt={""} className="w-[60px] rounded-full" />
            <img
              src={getTokenLogoURL(tokens[1].address, tokens[1].chainId)}
              alt={""}
              className="-ml-3 w-[60px] rounded-full"
            />
          </div>
          <div className="-mt-3 flex justify-center">
            <img src={getTokenLogoURL(tokens[2].address, tokens[2].chainId)} alt={""} className="w-[60px] rounded-full" />
            <img
              src={getTokenLogoURL(tokens[3].address, tokens[3].chainId)}
              alt={""}
              className="-ml-3 w-[60px] rounded-full"
            />
          </div>
        </div>
      );
    case 5:
      return (
        <div className="mt-4 w-fit items-center md:w-[160px]">
          <div className="flex justify-center">
            <img src={getTokenLogoURL(tokens[0].address, tokens[0].chainId)} alt={""} className="w-[60px] rounded-full" />
            <img
              src={getTokenLogoURL(tokens[1].address, tokens[1].chainId)}
              alt={""}
              className="-ml-3 w-[60px] rounded-full"
            />
            <img
              src={getTokenLogoURL(tokens[2].address, tokens[2].chainId)}
              alt={""}
              className="-ml-3 w-[60px] rounded-full"
            />
          </div>
          <div className="-mt-3 flex justify-center">
            <img src={getTokenLogoURL(tokens[3].address, tokens[3].chainId)} alt={""} className="w-[60px] rounded-full" />
            <img
              src={getTokenLogoURL(tokens[4].address, tokens[4].chainId)}
              alt={""}
              className="-ml-3 w-[60px] rounded-full"
            />
          </div>
        </div>
      );
    default:
      return <></>;
  }
};

export default IndexLogo;
