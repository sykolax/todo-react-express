export default function FormErrorMessage({ message }: { message: string }) {
    return <p className="text-xs text-red-600">{message}</p>
}