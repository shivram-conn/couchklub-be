export class HealthCheckUsecases {
  static async getHealthStatus() {
    return {
      success: true,
      data: {
        status: 'OK',
        timestamp: new Date().toISOString()
      }
    };
  }
}
