'use client';

import { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';

interface User {
  id: string;
  name: string;
  descriptor: Float32Array;
}

export default function FaceAuth() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [, setIsRegistering] = useState(false);
  const [userName, setUserName] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadModels();
    loadUsersFromStorage();
  }, []);

  const loadModels = async () => {
    try {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
      ]);
      setIsModelLoaded(true);
      setMessage('Models loaded successfully');
    } catch (error) {
      setMessage(
        'Error loading models. Please check if model files are in /public/models/'
      );
      console.error('Error loading models:', error);
    }
  };

  const loadUsersFromStorage = () => {
    const storedUsers = localStorage.getItem('faceAuthUsers');
    if (storedUsers) {
      const parsedUsers = JSON.parse(storedUsers);
      const usersWithDescriptors = parsedUsers.map((user: any) => ({
        ...user,
        descriptor: new Float32Array(user.descriptor),
      }));
      setUsers(usersWithDescriptors);
    }
  };

  const saveUsersToStorage = (newUsers: User[]) => {
    const usersToStore = newUsers.map((user) => ({
      ...user,
      descriptor: Array.from(user.descriptor),
    }));
    localStorage.setItem(
      'faceAuthUsers',
      JSON.stringify(usersToStore)
    );
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      setMessage('Error accessing camera');
      console.error('Error accessing camera:', error);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (
        videoRef.current.srcObject as MediaStream
      ).getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const registerFace = async () => {
    console.log('🚀 ~ registerFace ~ registerFace:');
    if (!videoRef.current || !userName.trim()) {
      console.log('1');
      setMessage('Please enter a name and ensure camera is active');
      return;
    }

    console.log('2');

    try {
      console.log('3');
      const detections = await faceapi
        .detectSingleFace(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions()
        )
        .withFaceLandmarks()
        .withFaceDescriptor();
      console.log('🚀 ~ registerFace ~ detections:', detections);

      if (!detections) {
        setMessage(
          'No face detected. Please ensure your face is visible.'
        );
        return;
      }

      const newUser: User = {
        id: Date.now().toString(),
        name: userName.trim(),
        descriptor: detections.descriptor,
      };

      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);
      saveUsersToStorage(updatedUsers);
      setMessage(`User ${userName} registered successfully!`);
      setUserName('');
      setIsRegistering(false);
      stopCamera();
    } catch (error) {
      console.log('🚀 ~ registerFace ~ error:', error);
      setMessage('Error during registration');
      console.error('Error during registration:', error);
    }
  };

  const authenticateFace = async () => {
    console.log('🚀 ~ authenticateFace ~ authenticateFace:');
    if (!videoRef.current) {
      setMessage('Camera not active');
      return;
    }

    console.log('users', users);
    if (users.length === 0) {
      setMessage('No registered users found');
      return;
    }

    try {
      const detections = await faceapi
        .detectSingleFace(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions()
        )
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detections) {
        setMessage('No face detected');
        return;
      }

      const faceMatcher = new faceapi.FaceMatcher(
        users.map(
          (user) =>
            new faceapi.LabeledFaceDescriptors(user.name, [
              user.descriptor,
            ])
        ),
        0.6
      );

      const match = faceMatcher.findBestMatch(detections.descriptor);

      if (match.label === 'unknown') {
        setMessage('Face not recognized');
        setCurrentUser(null);
      } else {
        const matchedUser = users.find(
          (user) => user.name === match.label
        );
        setCurrentUser(matchedUser || null);
        setMessage(
          `Welcome, ${
            match.label
          }! (Distance: ${match.distance.toFixed(2)})`
        );
      }
    } catch (error) {
      setMessage('Error during authentication');
      console.error('Error during authentication:', error);
    }
  };

  const clearUsers = () => {
    setUsers([]);
    setCurrentUser(null);
    localStorage.removeItem('faceAuthUsers');
    setMessage('All users cleared');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center">
        Face Authentication POC
      </h1>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          Status:{' '}
          {isModelLoaded ? '✅ Ready' : '⏳ Loading models...'}
        </p>
        {message && (
          <p className="mt-2 p-2 bg-blue-500 rounded text-sm">
            {message}
          </p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              muted
              className="w-full max-w-md mx-auto rounded-lg border"
              style={{ transform: 'scaleX(-1)' }}
            />
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 w-full h-full"
            />
          </div>

          <div className="flex gap-2 justify-center">
            <button
              onClick={startCamera}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              disabled={!isModelLoaded}
            >
              Start Camera
            </button>
            <button
              onClick={stopCamera}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Stop Camera
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="border border-gray-600 rounded-lg p-4 bg-gray-900">
            <h3 className="text-lg font-semibold mb-3 text-white">
              Register New User
            </h3>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your name"
              className="w-full p-2 border border-gray-600 rounded mb-3 bg-gray-800 text-white placeholder-gray-400"
            />
            <button
              onClick={registerFace}
              className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              disabled={!isModelLoaded || !userName.trim()}
            >
              Register Face
            </button>
          </div>

          <div className="border border-gray-600 rounded-lg p-4 bg-gray-900">
            <h3 className="text-lg font-semibold mb-3 text-white">
              Authentication
            </h3>
            <button
              onClick={authenticateFace}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mb-3"
              disabled={!isModelLoaded}
            >
              Authenticate Face
            </button>

            {currentUser && (
              <div className="p-3 bg-green-800 rounded">
                <p className="font-semibold text-white">
                  Authenticated User:
                </p>
                <p className="text-white">{currentUser.name}</p>
              </div>
            )}
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3">
              Registered Users ({users.length})
            </h3>
            <div className="space-y-2 mb-3">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="p-2 bg-black text-white rounded text-sm"
                >
                  {user.name}
                </div>
              ))}
            </div>
            <button
              onClick={clearUsers}
              className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Clear All Users
            </button>
          </div>
        </div>
      </div>

      <div className="text-sm text-gray-600 space-y-2">
        <p>
          <strong>Setup Instructions:</strong>
        </p>
        <ol className="list-decimal list-inside space-y-1 ml-4">
          <li>
            Download face-api.js models and place them in{' '}
            <code>/public/models/</code>
          </li>
          <li>Click &rdquo;Start Camera&rdquo; to begin</li>
          <li>
            Register a user by entering a name and clicking
            &rdquo;Register Face&rdquo;
          </li>
          <li>
            Test authentication by clicking &rdquo;Authenticate
            Face&rdquo;
          </li>
        </ol>
      </div>
    </div>
  );
}
