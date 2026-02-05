type Props = {
  title: string,
  subtitle?: string;
};

const AppHeader = ({ title, subtitle }: Props) => {
  return (
    <div className="content-center">
      <h1>{title}</h1>
      {
        subtitle != null && <p>{subtitle}</p>
      }
    </div>
  );
};

export default AppHeader;