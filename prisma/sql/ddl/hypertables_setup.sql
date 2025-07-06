-- Convert device_metrics table to hypertable 
SELECT create_hypertable('device_metrics', by_range('timestamp'), if_not_exists => TRUE);
