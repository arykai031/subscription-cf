/**
 * 订阅列表组件
 */
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * 订阅列表组件
 * @returns React.JSX.Element
 */
export function SubscriptionList(): React.JSX.Element {
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="email">Email</Label>
      <Input type="email" id="email" placeholder="Email" />
    </div>
  );
}
