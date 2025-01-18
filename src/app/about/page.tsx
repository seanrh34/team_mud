import '../globals.css';

export default function About() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">About Us</h1>
      <p className="text-lg text-gray-600 text-center max-w-2xl">
        Welcome to our website! We are dedicated to providing you with the best experience possible. Our mission is to
        create solutions that empower individuals and businesses to thrive in today's fast-paced world.
      </p>
      <div className="mt-8 space-y-4">
        <h2 className="text-2xl font-semibold text-gray-700">Our Values</h2>  
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-700">Contact Us</h2>
        <p className="text-gray-600 mt-2">
          If you have any questions or feedback, feel free to reach out to us at{" "}
          <a href="mailto:contact@example.com" className="text-blue-600 hover:underline">
            contact@example.com
          </a>.
        </p>
      </div>
    </div>
  );
}
