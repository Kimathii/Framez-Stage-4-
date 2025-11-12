// src/utils/imagePicker.ts
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

export const pickImage = async (): Promise<string | null> => {
  try {
    // Request permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please grant camera roll permissions to upload images'
      );
      return null;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8, // Compress to reduce upload size
    });

    if (!result.canceled && result.assets[0]) {
      return result.assets[0].uri;
    }

    return null;
  } catch (error) {
    console.error('❌ Error picking image:', error);
    Alert.alert('Error', 'Failed to pick image');
    return null;
  }
};

export const uploadToCloudinary = async (uri: string, cloudName: string, uploadPreset: string): Promise<string> => {
  try {
    console.log('📤 Uploading image to Cloudinary...');
    
    // Create form data
    const formData = new FormData();
    formData.append('file', {
      uri,
      type: 'image/jpeg',
      name: 'upload.jpg',
    } as any);
    formData.append('upload_preset', uploadPreset);

    // Upload to Cloudinary
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Upload failed');
    }

    const data = await response.json();
    console.log('✅ Image uploaded successfully!');
    console.log('🔗 Image URL:', data.secure_url);
    
    return data.secure_url;
  } catch (error: any) {
    console.error('❌ Cloudinary upload error:', error.message);
    throw error;
  }
};