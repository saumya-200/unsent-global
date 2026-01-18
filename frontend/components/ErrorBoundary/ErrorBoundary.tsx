'use client';

import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('[ErrorBoundary] Caught error:', error, errorInfo);
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="fixed inset-0 bg-black flex items-center justify-center p-8">
                    <div className="text-center max-w-md">
                        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                            <AlertTriangle className="w-8 h-8 text-red-400" />
                        </div>
                        <h1 className="text-xl font-bold text-white mb-2">
                            Something went wrong
                        </h1>
                        <p className="text-white/50 text-sm mb-6">
                            The cosmos encountered a disturbance. Don't worry, your stars are safe.
                        </p>
                        <button
                            onClick={this.handleRetry}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full font-bold text-sm hover:bg-white/90 transition-all"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Try Again
                        </button>
                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <pre className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-left text-xs text-red-300 overflow-auto max-h-40">
                                {this.state.error.toString()}
                            </pre>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
