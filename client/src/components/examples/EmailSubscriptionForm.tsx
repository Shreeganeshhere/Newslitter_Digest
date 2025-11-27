import EmailSubscriptionForm from "../EmailSubscriptionForm";

export default function EmailSubscriptionFormExample() {
  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Default Size</h3>
        <EmailSubscriptionForm />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4">Large Size</h3>
        <EmailSubscriptionForm size="large" />
      </div>
    </div>
  );
}
