import Header from "src/widgets/Header";

const PageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header /> {children}
    </>
  );
};

export default PageLayout;
