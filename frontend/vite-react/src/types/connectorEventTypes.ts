import type { ConnectorEventMap as WagmiConnectorMap } from "wagmi";

export type ExtendedConnectorEventMap = WagmiConnectorMap & {
    confirmTransaction: {transaction: any; resolve: (confirmed: boolean) => void};
}

export type ExtendedEmitter = {
    emit<EventName extends keyof ExtendedConnectorEventMap>(
      eventName: EventName,
      data: ExtendedConnectorEventMap[EventName]
    ): void;
    on<EventName extends keyof ExtendedConnectorEventMap>(
      eventName: EventName,
      listener: (data: ExtendedConnectorEventMap[EventName]) => void
    ): void;
    off<EventName extends keyof ExtendedConnectorEventMap>(
      eventName: EventName,
      listener: (data: ExtendedConnectorEventMap[EventName]) => void
    ): void;
  };