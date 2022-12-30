const MESSAGE_HEIGHT = 200;

export const isScrollNearBottom = (messageContainerRef: HTMLDivElement) => {
  return (
    Math.abs(
      messageContainerRef.scrollHeight -
        messageContainerRef.clientHeight -
        messageContainerRef.scrollTop
    ) < MESSAGE_HEIGHT
  );
};

export const scrollToBottom = (scrollRef: React.RefObject<HTMLDivElement>) => {
  scrollRef?.current?.scrollTo({ top: 20000, behavior: "smooth" });
};
