def cToFConverter():
    while True:
        cTemp = input("Please enter C defgree: ")
        if cTemp:
            cTemp = float((cTemp))
            fTemp = round(9*cTemp/5 + 32, 2)
            print(f"{cTemp}C is converted to {fTemp}F")
            break
        else:
            print("cTemp input is empty")
            continue

def main():
    # print("hello world")
    cToFConverter()
    
if __name__ == "__main__":
    main()