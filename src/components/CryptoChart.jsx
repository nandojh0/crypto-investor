import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer
} from 'recharts';

const CryptoChart = ({ data, crypto }) => {
    return (
        <div className="mb-4">
        <h4 className="text-center mb-3">
            {crypto?.name} ({crypto?.symbol})
        </h4>
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="fecha" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="precio" stroke="#8884d8" dot={false} />
            </LineChart>
        </ResponsiveContainer>
    </div>
    );
};

export default CryptoChart;