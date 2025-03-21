type LoadingProps = {
  size?: number;
};

export function Loading({ size }: LoadingProps) {
  return (
    <div className="flex justify-center">
      <div
        className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"
        style={{ width: size, height: size }}
      />
    </div>
  );
}
