import type { FC } from "react";

interface HelloProperties {
  readonly text: string;
  readonly age: number;
}

const Hello: FC<HelloProperties> = ({
  text,
  age,
}: Readonly<HelloProperties>) => {
  return (
    <div>
      Hello, {text}! My age is: {age}
    </div>
  );
};

export default Hello;
