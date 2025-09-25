import React, { useState } from 'react';
import { mockApi } from '../../services/mockApi';
import { Member, MemberStatus } from '../../types';

const Reportes: React.FC = () => {
  const [reportData, setReportData] = useState<Member[] | null>(null);
  const [reportType, setReportType] = useState('');

  const generateReport = async (type: 'delinquent' | 'byActivity') => {
    setReportType(type);
    const members = await mockApi.getMembers();
    if (type === 'delinquent') {
      setReportData(members.filter(m => m.status === MemberStatus.DELINQUENT));
    } else {
      // This is a simplified example. A real report would need more logic.
      const activityId = prompt("Ingrese el ID de la actividad para el reporte:");
      if (activityId && !isNaN(Number(activityId))) {
          setReportData(members.filter(m => m.activities.includes(Number(activityId))));
      } else if (activityId) {
          alert("Por favor, ingrese un ID de actividad válido.");
      }
    }
  };

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold text-white">Generación de Reportes</h1>
      <div className="p-6 bg-gray-800 rounded-lg">
        <h2 className="text-xl font-semibold text-white">Seleccionar Reporte</h2>
        <div className="flex mt-4 space-x-4">
          <button onClick={() => generateReport('delinquent')} className="px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">Socios Morosos</button>
          <button onClick={() => generateReport('byActivity')} className="px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">Socios por Actividad</button>
        </div>
      </div>
      {reportData && (
        <div className="mt-8">
            <h2 className="mb-4 text-2xl font-semibold text-white">
                Resultados del Reporte: {reportType === 'delinquent' ? 'Socios Morosos' : 'Socios por Actividad'}
            </h2>
             <div className="overflow-x-auto bg-gray-800 rounded-lg">
                <table className="min-w-full text-sm text-left text-gray-400">
                    <thead className="text-xs text-gray-300 uppercase bg-gray-700">
                        <tr>
                            <th scope="col" className="px-6 py-3">ID</th>
                            <th scope="col" className="px-6 py-3">Nombre</th>
                            <th scope="col" className="px-6 py-3">Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reportData.length > 0 ? reportData.map((member) => (
                            <tr key={member.id} className="border-b bg-gray-800 border-gray-700">
                                <td className="px-6 py-4">{member.id}</td>
                                <td className="px-6 py-4 text-white">{`${member.firstName} ${member.lastName}`}</td>
                                <td className="px-6 py-4">{member.status}</td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={3} className="px-6 py-4 text-center text-gray-400">No se encontraron resultados.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
             </div>
        </div>
      )}
    </div>
  );
};

export default Reportes;
