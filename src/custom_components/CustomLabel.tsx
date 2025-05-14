import { Label } from "@/components/ui/label"

export function CustomLabel({ labelName = "", className = "", ...props }) {
    return <Label className={className} {...props}>{labelName}</Label>;
}