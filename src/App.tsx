import React, { useState, useRef, useEffect } from 'react';
import mqtt from 'mqtt';

const getSvgUri = (svg: string) => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

const avatars = [
  // 1. Grandpa 1 (Brown hair, glasses)
  getSvgUri(`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M 20 100 C 20 65 80 65 80 100 Z" fill="#A07154"/><circle cx="28" cy="48" r="6" fill="#E5C1A7"/><circle cx="72" cy="48" r="6" fill="#E5C1A7"/><circle cx="50" cy="45" r="24" fill="#F4D2B8"/><path d="M 26 42 Q 25 30 35 22 Q 30 35 28 42 Z" fill="#D1D1D1"/><path d="M 74 42 Q 75 30 65 22 Q 70 35 72 42 Z" fill="#D1D1D1"/><circle cx="38" cy="44" r="7" fill="none" stroke="#4A3B32" stroke-width="2"/><circle cx="62" cy="44" r="7" fill="none" stroke="#4A3B32" stroke-width="2"/><line x1="45" y1="44" x2="55" y2="44" stroke="#4A3B32" stroke-width="2"/><line x1="31" y1="44" x2="26" y2="42" stroke="#4A3B32" stroke-width="2"/><line x1="69" y1="44" x2="74" y2="42" stroke="#4A3B32" stroke-width="2"/><circle cx="38" cy="44" r="2" fill="#4A3B32"/><circle cx="62" cy="44" r="2" fill="#4A3B32"/><path d="M 44 56 Q 50 62 56 56" fill="none" stroke="#4A3B32" stroke-width="2" stroke-linecap="round"/></svg>`),
  // 2. Grandma 1 (Pink shirt, gray hair bun)
  getSvgUri(`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M 20 100 C 20 65 80 65 80 100 Z" fill="#E8B4B8"/><circle cx="28" cy="48" r="6" fill="#E5C1A7"/><circle cx="72" cy="48" r="6" fill="#E5C1A7"/><circle cx="50" cy="45" r="24" fill="#F4D2B8"/><circle cx="50" cy="16" r="12" fill="#B0A9A1"/><path d="M 26 45 C 26 15 74 15 74 45 C 60 28 40 28 26 45 Z" fill="#B0A9A1"/><circle cx="40" cy="44" r="2" fill="#4A3B32"/><circle cx="60" cy="44" r="2" fill="#4A3B32"/><circle cx="34" cy="50" r="4" fill="#F0B5A1"/><circle cx="66" cy="50" r="4" fill="#F0B5A1"/><path d="M 45 56 Q 50 60 55 56" fill="none" stroke="#4A3B32" stroke-width="2" stroke-linecap="round"/></svg>`),
  // 3. Grandma 2 (Purple shirt, brown short hair)
  getSvgUri(`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M 20 100 C 20 65 80 65 80 100 Z" fill="#B4A0E5"/><circle cx="28" cy="48" r="6" fill="#E5C1A7"/><circle cx="72" cy="48" r="6" fill="#E5C1A7"/><circle cx="50" cy="45" r="24" fill="#F4D2B8"/><path d="M 24 52 C 18 30 35 12 50 18 C 65 12 82 30 76 52 C 70 35 60 25 50 28 C 40 25 30 35 24 52 Z" fill="#8B6B53"/><circle cx="40" cy="44" r="2" fill="#4A3B32"/><circle cx="60" cy="44" r="2" fill="#4A3B32"/><circle cx="34" cy="50" r="4" fill="#F0B5A1"/><circle cx="66" cy="50" r="4" fill="#F0B5A1"/><path d="M 45 56 Q 50 60 55 56" fill="none" stroke="#4A3B32" stroke-width="2" stroke-linecap="round"/></svg>`),
  // 4. Grandpa 2 (Blue shirt, bald with white sides)
  getSvgUri(`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M 20 100 C 20 65 80 65 80 100 Z" fill="#8AB4F8"/><circle cx="28" cy="48" r="6" fill="#E5C1A7"/><circle cx="72" cy="48" r="6" fill="#E5C1A7"/><circle cx="50" cy="45" r="24" fill="#F4D2B8"/><path d="M 26 42 Q 25 30 35 22 Q 30 35 28 42 Z" fill="#F0F0F0"/><path d="M 74 42 Q 75 30 65 22 Q 70 35 72 42 Z" fill="#F0F0F0"/><circle cx="40" cy="44" r="2" fill="#4A3B32"/><circle cx="60" cy="44" r="2" fill="#4A3B32"/><path d="M 44 56 Q 50 62 56 56" fill="none" stroke="#4A3B32" stroke-width="2" stroke-linecap="round"/></svg>`),
  // 5. Grandpa 3 (Green shirt, hat)
  getSvgUri(`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M 20 100 C 20 65 80 65 80 100 Z" fill="#81C995"/><circle cx="28" cy="48" r="6" fill="#E5C1A7"/><circle cx="72" cy="48" r="6" fill="#E5C1A7"/><circle cx="50" cy="45" r="24" fill="#F4D2B8"/><path d="M 20 35 Q 50 20 80 35 L 75 25 Q 50 10 25 25 Z" fill="#5A4A42"/><path d="M 30 25 Q 50 10 70 25 L 65 15 Q 50 5 35 15 Z" fill="#5A4A42"/><circle cx="40" cy="44" r="2" fill="#4A3B32"/><circle cx="60" cy="44" r="2" fill="#4A3B32"/><path d="M 44 56 Q 50 62 56 56" fill="none" stroke="#4A3B32" stroke-width="2" stroke-linecap="round"/></svg>`),
  // 6. Grandma 3 (Yellow shirt, curly gray hair)
  getSvgUri(`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M 20 100 C 20 65 80 65 80 100 Z" fill="#FDE293"/><circle cx="28" cy="48" r="6" fill="#E5C1A7"/><circle cx="72" cy="48" r="6" fill="#E5C1A7"/><circle cx="50" cy="45" r="24" fill="#F4D2B8"/><circle cx="35" cy="25" r="10" fill="#D1D1D1"/><circle cx="50" cy="20" r="12" fill="#D1D1D1"/><circle cx="65" cy="25" r="10" fill="#D1D1D1"/><circle cx="28" cy="38" r="8" fill="#D1D1D1"/><circle cx="72" cy="38" r="8" fill="#D1D1D1"/><circle cx="40" cy="44" r="2" fill="#4A3B32"/><circle cx="60" cy="44" r="2" fill="#4A3B32"/><circle cx="34" cy="50" r="4" fill="#F0B5A1"/><circle cx="66" cy="50" r="4" fill="#F0B5A1"/><path d="M 45 56 Q 50 60 55 56" fill="none" stroke="#4A3B32" stroke-width="2" stroke-linecap="round"/></svg>`),
  // 7. Grandpa 4 (Orange shirt, white beard)
  getSvgUri(`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M 20 100 C 20 65 80 65 80 100 Z" fill="#FCAD70"/><circle cx="28" cy="48" r="6" fill="#E5C1A7"/><circle cx="72" cy="48" r="6" fill="#E5C1A7"/><circle cx="50" cy="45" r="24" fill="#F4D2B8"/><path d="M 30 55 Q 50 80 70 55 Q 60 65 50 65 Q 40 65 30 55 Z" fill="#F0F0F0"/><path d="M 26 42 Q 25 30 35 22 Q 30 35 28 42 Z" fill="#F0F0F0"/><path d="M 74 42 Q 75 30 65 22 Q 70 35 72 42 Z" fill="#F0F0F0"/><circle cx="40" cy="44" r="2" fill="#4A3B32"/><circle cx="60" cy="44" r="2" fill="#4A3B32"/><path d="M 44 56 Q 50 62 56 56" fill="none" stroke="#4A3B32" stroke-width="2" stroke-linecap="round"/></svg>`),
  // 8. Grandma 4 (Teal shirt, black hair)
  getSvgUri(`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M 20 100 C 20 65 80 65 80 100 Z" fill="#4DB6AC"/><circle cx="28" cy="48" r="6" fill="#E5C1A7"/><circle cx="72" cy="48" r="6" fill="#E5C1A7"/><circle cx="50" cy="45" r="24" fill="#F4D2B8"/><path d="M 24 52 C 18 30 35 12 50 18 C 65 12 82 30 76 52 C 70 35 60 25 50 28 C 40 25 30 35 24 52 Z" fill="#2C2C2C"/><circle cx="40" cy="44" r="2" fill="#4A3B32"/><circle cx="60" cy="44" r="2" fill="#4A3B32"/><circle cx="34" cy="50" r="4" fill="#F0B5A1"/><circle cx="66" cy="50" r="4" fill="#F0B5A1"/><path d="M 45 56 Q 50 60 55 56" fill="none" stroke="#4A3B32" stroke-width="2" stroke-linecap="round"/></svg>`),
  // 9. Grandpa 5 (Red shirt, mustache)
  getSvgUri(`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M 20 100 C 20 65 80 65 80 100 Z" fill="#E57373"/><circle cx="28" cy="48" r="6" fill="#E5C1A7"/><circle cx="72" cy="48" r="6" fill="#E5C1A7"/><circle cx="50" cy="45" r="24" fill="#F4D2B8"/><path d="M 26 42 Q 25 30 35 22 Q 30 35 28 42 Z" fill="#5A4A42"/><path d="M 74 42 Q 75 30 65 22 Q 70 35 72 42 Z" fill="#5A4A42"/><path d="M 40 54 Q 50 50 60 54 Q 50 58 40 54 Z" fill="#5A4A42"/><circle cx="40" cy="44" r="2" fill="#4A3B32"/><circle cx="60" cy="44" r="2" fill="#4A3B32"/></svg>`),
  // 10. Grandma 5 (Indigo shirt, elegant white hair)
  getSvgUri(`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M 20 100 C 20 65 80 65 80 100 Z" fill="#7986CB"/><circle cx="28" cy="48" r="6" fill="#E5C1A7"/><circle cx="72" cy="48" r="6" fill="#E5C1A7"/><circle cx="50" cy="45" r="24" fill="#F4D2B8"/><path d="M 26 45 C 26 15 74 15 74 45 C 60 28 40 28 26 45 Z" fill="#F0F0F0"/><circle cx="40" cy="44" r="2" fill="#4A3B32"/><circle cx="60" cy="44" r="2" fill="#4A3B32"/><circle cx="34" cy="50" r="4" fill="#F0B5A1"/><circle cx="66" cy="50" r="4" fill="#F0B5A1"/><path d="M 45 56 Q 50 60 55 56" fill="none" stroke="#4A3B32" stroke-width="2" stroke-linecap="round"/></svg>`)
];

const initialLocations = [
  { id: '1', name: '陽光交誼廳', colSpan: 1 },
  { id: '2', name: '康健復健室', colSpan: 1 },
  { id: '3', name: '翠綠空中花園', colSpan: 2 },
  { id: '4', name: '藝文多功能室', colSpan: 2 }
];

const initialResidents = [
  { id: 'r1', name: '張爺爺', avatar: avatars[0], steps: 1240, hearts: 76, locationId: '1', topic: '1' },
  { id: 'r2', name: '陳奶奶', avatar: avatars[1], steps: 4520, hearts: 82, locationId: '2', topic: '2' },
  { id: 'r3', name: '李奶奶', avatar: avatars[2], steps: 3890, hearts: 74, locationId: '3', topic: '3' },
  { id: 'r4', name: '林伯伯', avatar: avatars[0], steps: 3200, hearts: 71, locationId: '3', topic: '4' },
  { id: 'r5', name: '王大伯', avatar: avatars[3], steps: 2750, hearts: 73, locationId: '4', topic: '5' }
];

export default function App() {
  const [locations, setLocations] = useState(initialLocations);
  const [residents, setResidents] = useState(initialResidents);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNameEditOpen, setIsNameEditOpen] = useState(false);
  const [avatarSelectorOpen, setAvatarSelectorOpen] = useState<string | null>(null);
  
  const [mqttConfig, setMqttConfig] = useState({
    url: 'ws://211.21.113.184:1884',
    username: 'superadmin',
    password: 'password123'
  });
  const [mqttStatus, setMqttStatus] = useState('未連線');

  const locationsRef = useRef(locations);
  useEffect(() => {
    locationsRef.current = locations;
  }, [locations]);

  // MQTT Connection Effect
  useEffect(() => {
    if (!mqttConfig.url) return;
    
    setMqttStatus('連線中...');
    let client: mqtt.MqttClient | null = null;
    
    let connectUrl = mqttConfig.url;
    
    try {
      client = mqtt.connect(connectUrl, {
        username: mqttConfig.username,
        password: mqttConfig.password,
        clientId: `mqttjs_${Math.random().toString(16).substr(2, 8)}`,
        reconnectPeriod: 5000,
        keepalive: 60,
        clean: true,
      });

      client.on('connect', () => {
        setMqttStatus('已連線');
        client?.subscribe('#'); // Subscribe to all topics for demo
      });

      client.on('message', (topic, message) => {
        const payloadStr = message.toString();
        console.log(`Received MQTT: ${topic} -> ${payloadStr}`);
        
        setResidents(prev => prev.map(r => {
          let updatedResident = { ...r };
          let changed = false;

          // 1. Health data from resident's specific topic
          if (r.topic === topic) {
            try {
              // Try to extract JSON if the payload has a prefix (e.g., "6: {...}")
              const jsonStart = payloadStr.indexOf('{');
              const jsonEnd = payloadStr.lastIndexOf('}');
              if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
                const jsonStr = payloadStr.substring(jsonStart, jsonEnd + 1);
                const data = JSON.parse(jsonStr);
                if (data.heart_rate !== undefined) {
                  updatedResident.hearts = data.heart_rate;
                  changed = true;
                }
                if (data.step !== undefined) {
                  updatedResident.steps = data.step;
                  changed = true;
                }
              } else if (payloadStr === 'offline') {
                updatedResident.locationId = null;
                changed = true;
              }
            } catch (e) {
              // Ignore parsing errors
            }
          }

          // 2. Location data from loc/zone/ topic
          if (topic.startsWith('loc/zone/')) {
            const nameFromTopic = topic.replace('loc/zone/', '');
            if (r.name === nameFromTopic) {
              const locId = payloadStr.trim();
              const locExists = locationsRef.current.some(l => l.id === locId);
              if (locExists) {
                updatedResident.locationId = locId;
                changed = true;
              } else if (locId === 'offline') {
                updatedResident.locationId = null;
                changed = true;
              }
            }
          }

          return changed ? updatedResident : r;
        }));
      });

      client.on('error', (err) => {
        console.error('MQTT Error:', err);
        setMqttStatus('連線錯誤');
      });
    } catch (err) {
      console.error('MQTT Connect Error:', err);
      setMqttStatus('連線錯誤');
    }

    return () => {
      if (client) {
        client.end();
      }
    };
  }, [mqttConfig]);

  const [isConfirmResetOpen, setIsConfirmResetOpen] = useState(false);

  // Handlers
  const handleResetData = () => {
    setIsConfirmResetOpen(true);
  };

  const confirmResetData = () => {
    setResidents(prev => prev.map(r => ({ ...r, steps: 0, hearts: 0, locationId: null })));
    setIsConfirmResetOpen(false);
  };

  const handleAddLocation = () => {
    const maxId = locations.reduce((max, loc) => Math.max(max, parseInt(loc.id) || 0), 0);
    const newId = (maxId + 1).toString();
    setLocations([...locations, { id: newId, name: `新房間 ${newId}`, colSpan: 1 }]);
  };

  const handleUpdateLocation = (id: string, newName: string) => {
    setLocations(prev => prev.map(l => l.id === id ? { ...l, name: newName } : l));
  };

  const handleDeleteLocation = (id: string) => {
    setLocations(prev => prev.filter(l => l.id !== id));
    // Remove residents from this location
    setResidents(prev => prev.map(r => r.locationId === id ? { ...r, locationId: null } : r));
  };

  const handleAddResident = () => {
    const newId = `r${Date.now()}`;
    const maxTopic = residents.reduce((max, res) => Math.max(max, parseInt(res.topic) || 0), 0);
    const newTopic = (maxTopic + 1).toString();
    setResidents([...residents, {
      id: newId,
      name: `新成員 ${newTopic}`,
      avatar: avatars[0],
      locationId: null,
      topic: newTopic,
      steps: 0,
      hearts: 0
    }]);
  };

  const handleUpdateResident = (id: string, field: string, value: string) => {
    setResidents(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const handleDeleteResident = (id: string) => {
    setResidents(prev => prev.filter(r => r.id !== id));
  };

  // Derived state
  const totalSteps = residents.reduce((sum, r) => sum + r.steps, 0);
  const activeResidentsCount = residents.filter(r => r.locationId).length;
  
  const locCounts = residents.reduce((acc, r) => {
    if (r.locationId) acc[r.locationId] = (acc[r.locationId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  let popularLocId = null;
  let maxCount = 0;
  for (const [id, count] of Object.entries(locCounts)) {
    if ((count as number) > maxCount) {
      maxCount = count as number;
      popularLocId = id;
    }
  }
  const popularLocName = locations.find(l => l.id === popularLocId)?.name || '無';

  const locationsWithPeople = locations.map(loc => ({
    ...loc,
    people: residents.filter(r => r.locationId === loc.id)
  }));

  const leaderboard = [...residents]
    .sort((a, b) => b.steps - a.steps)
    .map((r, i) => ({ ...r, rank: i + 1 }));

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen bg-gray-50/50">
      <header className="flex justify-between items-end mb-10">
        <div>
          <div className="bg-[#EFEBE0] text-[#6B4C3E] text-sm font-black px-3 py-1 inline-block rounded mb-2 tracking-wide">
            ACTIVE VITALITY HUB
          </div>
          <h1 className="text-5xl font-black text-primary tracking-tight">活力追蹤系統</h1>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="bg-white shadow-sm hover:shadow-md transition-shadow px-6 py-4 rounded-xl flex items-center gap-3 text-lg font-black text-primary border-2 border-gray-100"
          >
            <span className="bg-blue-100 text-blue-500 rounded-lg w-10 h-10 flex items-center justify-center">
              <span className="material-icons-round text-2xl">settings</span>
            </span>
            系統設定
          </button>
          <button 
            onClick={() => setIsNameEditOpen(true)}
            className="bg-white shadow-sm hover:shadow-md transition-shadow px-6 py-4 rounded-xl flex items-center gap-3 text-lg font-black text-primary border-2 border-gray-100"
          >
            <span className="bg-orange-100 text-orange-500 rounded-lg w-10 h-10 flex items-center justify-center">
              <span className="material-icons-round text-2xl">edit</span>
            </span>
            名單設定
          </button>
        </div>
      </header>

      {/* Top Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-[#F2F8FF] rounded-3xl p-8 relative overflow-hidden shadow-sm flex flex-col justify-between border-2 border-[#DCE8FE] min-h-[180px]">
          <div className="relative z-10 flex justify-between items-center mb-6 pt-4">
            <div className="bg-white p-3 rounded-full shadow-sm inline-flex items-center justify-center w-14 h-14">
              <span className="material-icons-round text-[#3B82F6] text-4xl animate-pulse">groups</span>
            </div>
            <span className="bg-[#DCE8FE] text-[#3B82F6] text-sm font-black px-4 py-1.5 rounded-full">
              {residents.length > 0 ? Math.round((activeResidentsCount / residents.length) * 100) : 0}% 在此
            </span>
          </div>
          <div className="relative z-10 flex flex-col gap-1">
            <div className="font-black text-primary leading-none text-6xl">{activeResidentsCount}</div>
            <div className="text-lg text-gray-500 font-bold tracking-wide">活躍住民</div>
          </div>
        </div>

        <div className="bg-[#FCF5FF] rounded-3xl p-8 relative overflow-hidden shadow-sm flex flex-col justify-between border-2 border-[#F3E1FF] min-h-[180px]">
          <div className="relative z-10 flex justify-between items-center mb-6 pt-4">
            <div className="bg-white p-3 rounded-full shadow-sm inline-flex items-center justify-center w-14 h-14">
              <span className="material-icons-round text-[#A855F7] text-4xl">directions_run</span>
            </div>
            <span className="bg-[#F3E1FF] text-[#A855F7] text-sm font-black px-4 py-1.5 rounded-full">
              總計
            </span>
          </div>
          <div className="relative z-10 flex flex-col gap-1">
            <div className="font-black text-primary leading-none text-6xl">{totalSteps.toLocaleString()}</div>
            <div className="text-lg text-gray-500 font-bold tracking-wide">總步數</div>
          </div>
        </div>

        <div className="bg-[#FFF9F0] rounded-3xl p-8 relative overflow-hidden shadow-sm flex flex-col justify-between border-2 border-[#FFE8D1] min-h-[180px]">
          <div className="relative z-10 flex justify-between items-center mb-6 pt-4">
            <div className="bg-white p-3 rounded-full shadow-sm inline-flex items-center justify-center w-14 h-14">
              <span className="material-icons-round text-[#F97316] text-4xl">favorite</span>
            </div>
            <span className="bg-[#FFE8D1] text-[#F97316] text-sm font-black px-4 py-1.5 rounded-full">
              首選場域
            </span>
          </div>
          <div className="relative z-10 flex flex-col gap-1">
            <div className="font-black text-primary leading-tight text-4xl truncate">{popularLocName}</div>
            <div className="text-lg text-gray-500 font-bold tracking-wide">目前最受歡迎</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-2 h-10 bg-orange-500 rounded-full"></div>
              <h2 className="text-3xl font-black text-primary">場域即時動態</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {locationsWithPeople.map((location) => (
              <div key={location.id} className={`bg-white p-8 rounded-3xl shadow-sm border-2 border-transparent hover:border-orange-200 transition-all ${location.colSpan === 2 ? 'md:col-span-2' : ''}`}>
                <div className="flex justify-between items-start mb-8">
                  <h3 className="font-black text-2xl text-primary">{location.name}</h3>
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                    <span className="material-icons-round text-orange-500 text-lg">location_on</span>
                  </div>
                </div>
                <div className={`flex ${location.people.length > 1 ? 'flex-wrap gap-4' : 'space-y-4'}`}>
                  {location.people.length === 0 && (
                    <div className="text-gray-400 font-bold">目前無人在此</div>
                  )}
                  {location.people.map((person, idx) => (
                    <div key={idx} className={`bg-orange-50 rounded-3xl p-4 flex items-center gap-5 border border-orange-100 ${location.people.length > 1 ? 'flex-1 min-w-[280px] px-6' : 'gap-6 inline-flex'}`}>
                      <div className={`rounded-full avatar-container border-4 border-white shadow-md ${location.people.length > 1 ? 'w-16 h-16 border-2' : 'w-20 h-20'}`}>
                        <img alt={person.name} className="avatar-img w-full h-full object-cover" src={person.avatar} />
                      </div>
                      <div>
                        <div className={`${location.people.length > 1 ? 'text-xl' : 'text-2xl mb-1'} font-black text-gray-900`}>{person.name}</div>
                        <div className={`flex ${location.people.length > 1 ? 'gap-4 text-base' : 'gap-6 text-lg'} text-gray-700 font-black`}>
                          <span className="flex items-center gap-2"><span className={`material-icons-round icon-footprint ${location.people.length > 1 ? 'text-xl' : 'text-3xl'}`}>pets</span> {person.steps.toLocaleString()}</span>
                          <span className="flex items-center gap-2"><span className={`material-icons-round icon-heart ${location.people.length > 1 ? 'text-xl' : 'text-3xl'}`}>favorite</span> {person.hearts}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDEBAR: VITALITY LEADERBOARD */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-md h-full border-2 border-gray-50">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-full bg-yellow-100 flex items-center justify-center shadow-inner">
              <span className="material-icons-round text-yellow-600 text-3xl animate-wiggle">emoji_events</span>
            </div>
            <div>
              <h2 className="font-black text-2xl text-primary">本週活力榜</h2>
              <p className="text-sm text-gray-600 font-black">為長輩們加油打氣！</p>
            </div>
          </div>
          <div className="space-y-6">
            {leaderboard.map((person) => (
              <div key={person.rank} className={
                person.rank === 1 ? "bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-4 flex items-center gap-5 shadow-sm" :
                person.rank === 2 ? "bg-gray-50 border-2 border-gray-200 rounded-2xl p-4 flex items-center gap-5" :
                person.rank === 3 ? "bg-orange-50 border-2 border-orange-100 rounded-2xl p-4 flex items-center gap-5" :
                "bg-gray-50/50 rounded-2xl p-4 flex items-center gap-5"
              }>
                <div className="flex-shrink-0 w-16 flex justify-center relative">
                  {person.rank === 1 && <span className="material-icons-round text-yellow-500 text-6xl drop-shadow-sm animate-bounce-slight">emoji_events</span>}
                  {person.rank === 2 && <span className="material-icons-round text-gray-400 text-6xl drop-shadow-sm animate-float">military_tech</span>}
                  {person.rank === 3 && <span className="material-icons-round text-amber-700 text-6xl drop-shadow-sm animate-float" style={{ animationDelay: '0.5s' }}>military_tech</span>}
                  {person.rank > 3 && <div className="text-gray-400 font-black text-2xl">{person.rank}</div>}
                </div>
                <div className="w-14 h-14 rounded-full avatar-container border-2 border-white shadow-sm overflow-hidden">
                  <img alt={person.name} className="w-full h-full object-cover" src={person.avatar} />
                </div>
                <div className="flex-grow">
                  <div className="font-black text-xl text-primary">{person.name}</div>
                  <div className="text-base text-gray-700 font-black flex items-center gap-4">
                    <span className="flex items-center gap-1"><span className="material-icons-round icon-footprint text-xl">pets</span> {person.steps.toLocaleString()}</span>
                    <span className="flex items-center gap-1"><span className="material-icons-round icon-heart text-xl">favorite</span> {person.hearts}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-blue-50/50">
              <h2 className="text-2xl font-black text-primary flex items-center gap-3">
                <span className="material-icons-round text-blue-500">settings</span>
                系統設定
              </h2>
              <button onClick={() => setIsSettingsOpen(false)} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-500 hover:text-gray-800 hover:bg-gray-50 transition-colors">
                <span className="material-icons-round">close</span>
              </button>
            </div>
            
            <div className="p-8 overflow-y-auto flex-grow bg-gray-50/30 space-y-8">
              
              {/* Top Row: Backup & Reset */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-black text-gray-800 mb-2 flex items-center gap-2">
                    <span className="material-icons-round text-blue-500">description</span>
                    設定檔備份與還原
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">您可以將目前的設定與名單匯出成檔案，傳送到另一台電腦匯入。</p>
                  <div className="flex gap-4">
                    <button className="flex-1 border border-blue-200 text-blue-600 font-bold py-2 rounded-xl hover:bg-blue-50 transition-colors flex items-center justify-center gap-2">
                      <span className="material-icons-round text-sm">download</span> 匯出設定 (JSON)
                    </button>
                    <button className="flex-1 border border-gray-200 text-gray-600 font-bold py-2 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                      <span className="material-icons-round text-sm">upload</span> 匯入設定
                    </button>
                  </div>
                </div>

                <div className="bg-red-50 p-6 rounded-2xl border border-red-100 shadow-sm">
                  <h3 className="text-lg font-black text-red-800 mb-2 flex items-center gap-2">
                    <span className="material-icons-round">refresh</span>
                    數據重置
                  </h3>
                  <p className="text-sm text-red-600/80 mb-4">將所有次數、時間歸零，重新開始計算。</p>
                  <button 
                    onClick={handleResetData}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-xl transition-colors"
                  >
                    重置比賽數據
                  </button>
                </div>
              </div>

              {/* MQTT Settings */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-black text-gray-800 border-l-4 border-blue-500 pl-3">MQTT 感測器連線設定</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${mqttStatus === '已連線' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {mqttStatus}
                  </span>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-600 mb-1">MQTT Broker URL (WebSocket)</label>
                    <input 
                      type="text" 
                      value={mqttConfig.url}
                      onChange={e => setMqttConfig({...mqttConfig, url: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                    <p className="text-xs text-gray-400 mt-1">此設定用於接收跳繩與手環的即時數據，請確保所有電腦連線至同一個 Broker。</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-600 mb-1">帳號 (Username)</label>
                      <input 
                        type="text" 
                        value={mqttConfig.username}
                        onChange={e => setMqttConfig({...mqttConfig, username: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-600 mb-1">密碼 (Password)</label>
                      <input 
                        type="password" 
                        value={mqttConfig.password}
                        onChange={e => setMqttConfig({...mqttConfig, password: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Rooms Management */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-black text-gray-800 border-l-4 border-green-500 pl-3">位置</h3>
                  <button onClick={handleAddLocation} className="text-sm bg-green-50 text-green-600 font-bold px-3 py-1.5 rounded-lg hover:bg-green-100 flex items-center gap-1">
                    <span className="material-icons-round text-sm">add</span> 新增位置
                  </button>
                </div>
                <div className="space-y-3">
                  {locations.map((loc) => (
                    <div key={loc.id} className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
                      <div className="w-8 h-8 flex items-center justify-center font-black text-sm text-gray-500 bg-white rounded-full border border-gray-200 shadow-sm flex-shrink-0" title="位置編號 (Payload)">{loc.id}</div>
                      <input 
                        type="text" 
                        value={loc.name}
                        onChange={e => handleUpdateLocation(loc.id, e.target.value)}
                        className="flex-grow bg-white border border-gray-200 rounded-lg px-3 py-1.5 font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                      />
                      <button onClick={() => handleDeleteLocation(loc.id)} className="text-gray-400 hover:text-red-500 p-1">
                        <span className="material-icons-round">delete</span>
                      </button>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-3">當收到 loc/zone/[成員名稱] 的主題，且 payload 為位置編號時，成員會移動到該位置。收到 offline 則離開地圖。</p>
              </div>

              {/* Members Management */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-black text-gray-800 border-l-4 border-purple-500 pl-3">成員名單與主題</h3>
                  <button onClick={handleAddResident} className="text-sm bg-purple-50 text-purple-600 font-bold px-3 py-1.5 rounded-lg hover:bg-purple-100 flex items-center gap-1">
                    <span className="material-icons-round text-sm">add</span> 新增成員
                  </button>
                </div>
                <div className="space-y-3">
                  {residents.map((res, index) => (
                    <div key={res.id} className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                      <div className="w-8 h-8 flex items-center justify-center font-black text-sm text-gray-500 bg-white rounded-full border border-gray-200 shadow-sm flex-shrink-0">{index + 1}</div>
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 flex-shrink-0">
                        <img src={res.avatar} alt={res.name} className="w-full h-full object-cover" />
                      </div>
                      <input 
                        type="text" 
                        value={res.name}
                        onChange={e => handleUpdateResident(res.id, 'name', e.target.value)}
                        placeholder="名稱"
                        className="w-24 bg-white border border-gray-200 rounded-lg px-3 py-1.5 font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                      />
                      <div className="flex-grow flex items-center gap-2">
                        <input 
                          type="text" 
                          value={res.topic}
                          onChange={e => handleUpdateResident(res.id, 'topic', e.target.value)}
                          placeholder="例如: mqtt/locate/data0001"
                          className="flex-grow bg-white border border-gray-200 rounded-lg px-3 py-1.5 font-mono text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        />
                      </div>
                      <button onClick={() => handleDeleteResident(res.id)} className="text-gray-400 hover:text-red-500 p-1">
                        <span className="material-icons-round">delete</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Name Edit Modal */}
      {isNameEditOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-orange-50/50">
              <h2 className="text-2xl font-black text-primary flex items-center gap-3">
                <span className="material-icons-round text-orange-500">edit_square</span>
                住民名稱與頭像編輯
              </h2>
              <button onClick={() => setIsNameEditOpen(false)} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-500 hover:text-gray-800 hover:bg-gray-50 transition-colors">
                <span className="material-icons-round">close</span>
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-grow bg-gray-50/30 space-y-6">
              <div className="flex justify-between items-center">
                <p className="text-gray-600 font-bold">管理住民名單與頭像</p>
                <button onClick={handleAddResident} className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-xl transition-colors flex items-center gap-2">
                  <span className="material-icons-round text-sm">add</span> 新增住民
                </button>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {residents.map((res, index) => (
                  <div key={res.id} className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
                    <div className="w-12 text-center font-mono text-sm text-gray-500 font-bold bg-gray-50 py-1 rounded border border-gray-200">
                      #{res.topic}
                    </div>
                    
                    <div className="relative">
                      <button 
                        onClick={() => setAvatarSelectorOpen(avatarSelectorOpen === res.id ? null : res.id)}
                        className="w-16 h-16 rounded-full overflow-hidden border-2 border-orange-200 hover:border-orange-500 transition-colors relative group"
                      >
                        <img src={res.avatar} alt={res.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="material-icons-round text-white text-xl">photo_camera</span>
                        </div>
                      </button>
                      
                      {avatarSelectorOpen === res.id && (
                        <div className="absolute top-full left-0 mt-2 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 z-10 w-72 grid grid-cols-5 gap-2">
                          <div className="col-span-5 flex justify-between items-center mb-2">
                            <span className="text-xs font-bold text-gray-500">選擇頭像</span>
                            <label className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded cursor-pointer hover:bg-blue-100 font-bold">
                              上傳照片
                              <input 
                                type="file" 
                                accept="image/*" 
                                className="hidden" 
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onload = (event) => {
                                      if (event.target?.result) {
                                        handleUpdateResident(res.id, 'avatar', event.target.result as string);
                                        setAvatarSelectorOpen(null);
                                      }
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                              />
                            </label>
                          </div>
                          {avatars.map((av, i) => (
                            <button 
                              key={i} 
                              onClick={() => { handleUpdateResident(res.id, 'avatar', av); setAvatarSelectorOpen(null); }}
                              className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 hover:border-orange-500 hover:scale-110 transition-all"
                            >
                              <img src={av} alt={`Avatar ${i+1}`} className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <input 
                      type="text" 
                      value={res.name}
                      onChange={e => handleUpdateResident(res.id, 'name', e.target.value)}
                      placeholder="住民名稱"
                      className="flex-grow bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500/50 text-lg"
                    />
                    
                    <button onClick={() => handleDeleteResident(res.id)} className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors">
                      <span className="material-icons-round">delete</span>
                    </button>
                  </div>
                ))}
                {residents.length === 0 && (
                  <div className="text-center py-8 text-gray-400 font-bold">目前沒有住民，請點擊上方按鈕新增。</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Confirm Reset Modal */}
      {isConfirmResetOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-black text-red-600 mb-4 flex items-center gap-2">
              <span className="material-icons-round">warning</span>
              確認重置數據
            </h3>
            <p className="text-gray-600 mb-6 font-bold">
              確定要重置所有比賽數據嗎？總步數與熱門地點將歸零，此操作無法復原。
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setIsConfirmResetOpen(false)}
                className="px-4 py-2 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors"
              >
                取消
              </button>
              <button 
                onClick={confirmResetData}
                className="px-4 py-2 rounded-xl font-bold bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                確定重置
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
