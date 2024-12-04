import tensorflow as tf
from tensorflow.keras import Sequential
from tensorflow.keras import layers
from tensorflow.keras.layers import Dense, Flatten
from tensorflow.keras.datasets import mnist
from tensorflow.keras.utils import to_categorical

# Bước 1: Tải dữ liệu MNIST
(x_train, y_train), (x_test, y_test) = mnist.load_data()


# Chuẩn hóa lại dữ liệu
x_train = x_train.reshape((x_train.shape[0], 28, 28, 1))
x_test = x_test.reshape((x_test.shape[0], 28, 28, 1))
x_train = x_train / 255.0
x_test = x_test / 255.0

y_train = to_categorical(y_train, 10)
y_test = to_categorical(y_test, 10)

# Bước 2: Tạo kiến trúc mô hình
model = Sequential([
    layers.Conv2D(32, (3, 3), activation='relu', input_shape=(28, 28, 1)),
    
    # Lớp Conv2D + ReLU
    layers.Conv2D(64, (3, 3), activation='relu'),
    
    # Lớp Flatten
    layers.Flatten(),
    
    # Lớp Dense 1 (Fully Connected)
    layers.Dense(128, activation='relu'),

    layers.Dropout(0.5),
    
    # Lớp Dense 2 (Fully Connected)
    layers.Dense(10, activation='softmax')  # Output layer with 10 classes
])

# Bước 3: Compile mô hình
model.compile(
    optimizer='adam',
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

# Bước 4: Huấn luyện mô hình
model.fit(x_train, y_train, epochs=10, batch_size=64, validation_split=0.2)

# Đánh giá mô hình trên bộ test
test_loss, test_acc = model.evaluate(x_test, y_test)
print(f"Test accuracy: {test_acc}")
# Lưu mô hình nếu cần
model.save('mnist_model.h5')

import matplotlib.pyplot as plt

# Hiển thị một số ảnh từ tập huấn luyện
# for i in range(5):
#     plt.imshow(x_train[i], cmap='gray')
#     plt.title(f"Label: {y_train[i]}")
#     plt.show()
