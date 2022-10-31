import { ReactNode } from "react";
import { motion } from "framer-motion";
import Container from "./layout/Container";

// TIP: If you want words to be highlighted use JSX in the prop
// and wrap the word in <mark> tags

const PageHeader = ({ title, summary, children }: PageHeaderProps) => (
  <motion.section className="">
    <Container className="py-16">
      <header className="max-w-md font-brand">
        <h1 className="text-4xl font-extrabold text-slate-600 dark:text-slate-400">
          {title}
        </h1>
        {summary && <p className="mt-4">{summary}</p>}
      </header>
      {children}
    </Container>
  </motion.section>
);

type PageHeaderProps = {
  children?: ReactNode;
  title: string | ReactNode;
  summary?: string | ReactNode;
};

export default PageHeader;
