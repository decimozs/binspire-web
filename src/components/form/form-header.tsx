import { Link } from "@tanstack/react-router";
import Logo from "../core/logo";
import { Button } from "../ui/button";

interface FormHeaderProps {
  formTitle: string;
  formDescription: string;
  isModal?: boolean;
  status?: "success" | "fail" | undefined;
}

export default function FormHeader({ props }: { props: FormHeaderProps }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <Logo status={props.status} />
      <div className="flex items-center flex-col gap-2">
        <h1 className="text-lg font-medium">{props.formTitle}</h1>
        <p className="text-sm wrap text-muted-foreground text-center">
          {props.formDescription}
        </p>
        {props.isModal && (
          <Link to="/">
            <Button type="button" className="w-full mt-4">
              Back to Home
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
