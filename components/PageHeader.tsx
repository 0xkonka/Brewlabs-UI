import { motion } from "framer-motion";
import Container from "./layout/Container";

const PageHeader = () => (
  <motion.section className="">
    <Container className="py-16">
      <header className="font-brand max-w-md">
        <h1 className="text-4xl font-extrabold text-slate-600 dark:text-slate-400">
          Discover the power of{" "}
          <span className="text-dark dark:text-brand tracking-wider">
            farming
          </span>{" "}
          staked liquidity.
        </h1>

        <p className="mt-4">
          Stake liquidity tokens in our Brewlabs farming platform for passive
          income.
        </p>

        <a href="#" className="block underline mt-4 font-semibold">
          Learn more about farming here
        </a>
      </header>
    </Container>
  </motion.section>
);

export default PageHeader;
