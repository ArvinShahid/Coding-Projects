import pickle
import json
import numpy as np
# from sklearn.linear_model import LinearRegression

__model = None
__data_columns = None
__locations = None


def get_estimate_price(bhk, size, n_bath, locn):

	locn = locn.lower()
	arr = np.zeros((1,len(__data_columns)))
	arr[0][0] = bhk
	arr[0][1] = size
	arr[0][2] = n_bath

	try:
		pos = __data_columns.index(locn)
		arr[0][pos] = 1
	except:
		pass
	
	price = __model.predict(arr)[0]
	return round(price,3)

def load_data():

	global __locations, __model, __data_columns

	print('Starting to load data...')

	with open('./data/bengaluru_cols.json', 'r') as fobj:
		__data_columns = json.load(fobj) #list of columns
		__locations = __data_columns[3:] #list of places

	with open('./data/bengaluru_model.pickle', 'rb') as fobj:
		__model = pickle.load(fobj)

	print('Data Loaded Successfully!...')


def get_locations():
	return __locations

if __name__ == '__main__':
	load_data()
	# print(get_locations())

	# print(get_estimate_price(3, 1000, 3, '1st Phase JP Nagar'))
	# print(get_estimate_price(2, 1000, 2, '1st Phase JP Nagar'))
	# print(get_estimate_price(2, 1000, 2, 'Kalhalli'))
	# print(get_estimate_price(2, 1000, 2, 'Eji-veji-pura'))