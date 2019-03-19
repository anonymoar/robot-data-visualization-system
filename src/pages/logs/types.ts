export interface ILogRecord {
  tag: string;
  created: number;
  message: string;
  exception?: string;
  level: 'NOTSET' | 'DEBUG' | 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
}
