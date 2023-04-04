import getTokenLogoURL from "utils/getTokenLogoURL";

const IndexLogo = ({ tokens, classNames = "mr-3" }) => {
  switch (tokens.length) {
    case 2:
      return (
        <div className={classNames}>
          <div className="flex">
            <img src={getTokenLogoURL(tokens[0].address, tokens[0].chainId)} alt={""} className="w-7 rounded-full" />
            <img
              src={getTokenLogoURL(tokens[1].address, tokens[1].chainId)}
              alt={""}
              className="-ml-3 w-7 rounded-full"
            />
          </div>
        </div>
      );
    case 3:
      return (
        <div className={classNames}>
          <div className="flex">
            <img src={getTokenLogoURL(tokens[0].address, tokens[0].chainId)} alt={""} className="w-6 rounded-full" />
            <img
              src={getTokenLogoURL(tokens[1].address, tokens[1].chainId)}
              alt={""}
              className="-ml-2 w-6 rounded-full"
            />
          </div>
          <div className="-mt-2">
            <img
              src={getTokenLogoURL(tokens[2].address, tokens[2].chainId)}
              alt={""}
              className="m-auto w-6 rounded-full"
            />
          </div>
        </div>
      );
    case 4:
      return (
        <div className={classNames}>
          <div className="flex">
            <img src={getTokenLogoURL(tokens[0].address, tokens[0].chainId)} alt={""} className="w-6 rounded-full" />
            <img
              src={getTokenLogoURL(tokens[1].address, tokens[1].chainId)}
              alt={""}
              className="-ml-2 w-6 rounded-full"
            />
          </div>
          <div className="-mt-2 flex">
            <img src={getTokenLogoURL(tokens[2].address, tokens[2].chainId)} alt={""} className="w-6 rounded-full" />
            <img
              src={getTokenLogoURL(tokens[3].address, tokens[3].chainId)}
              alt={""}
              className="-ml-2 w-6 rounded-full"
            />
          </div>
        </div>
      );
    case 5:
      return (
        <div className={classNames}>
          <div className="flex">
            <img src={getTokenLogoURL(tokens[0].address, tokens[0].chainId)} alt={""} className="w-6 rounded-full" />
            <img
              src={getTokenLogoURL(tokens[1].address, tokens[1].chainId)}
              alt={""}
              className="-ml-2 w-6 rounded-full"
            />
            <img
              src={getTokenLogoURL(tokens[2].address, tokens[2].chainId)}
              alt={""}
              className="-ml-2 w-6 rounded-full"
            />
          </div>
          <div className="-mt-2 flex justify-center">
            <img src={getTokenLogoURL(tokens[3].address, tokens[3].chainId)} alt={""} className="w-6 rounded-full" />
            <img
              src={getTokenLogoURL(tokens[4].address, tokens[4].chainId)}
              alt={""}
              className="-ml-2 w-6 rounded-full"
            />
          </div>
        </div>
      );
    default:
      return <></>;
  }
};

export default IndexLogo;
