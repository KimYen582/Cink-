import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    if (import.meta.env.DEV) {
      console.error('[ErrorBoundary]', error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#09090B] text-white px-6">
          <div className="max-w-md text-center">
            <div className="text-6xl mb-4">😵</div>
            <h1 className="text-2xl font-semibold mb-2">Ôi! Đã có lỗi xảy ra.</h1>
            <p className="text-gray-400 mb-6">
              Đã xảy ra lỗi không mong muốn. Vui lòng thử tải lại trang.
            </p>
            {import.meta.env.DEV && this.state.error && (
              <pre className="text-left text-xs text-red-400 bg-red-900/20 border border-red-800 rounded-lg p-4 mb-6 overflow-auto max-h-40">
                {this.state.error.toString()}
              </pre>
            )}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={this.handleReset}
                className="px-6 py-2.5 bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer"
              >
                Tiếp tục
              </button>
              <button
                onClick={() => (window.location.href = '/')}
                className="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 transition rounded-full font-medium cursor-pointer"
              >
                Về trang chủ
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
