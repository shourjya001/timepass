CREATE OR REPLACE FUNCTION dbo."SPU_TPRIREFDBE"()
RETURNS void
LANGUAGE plpgsql  
AS $function$
DECLARE
    OpenedTran BOOLEAN;
    CODPRIMROL VARCHAR(100);  -- Increased length to handle concatenation
    NAMPRIMROL VARCHAR(100);  -- Also stores concatenated values
    ACTIONCODE INTEGER;
    WK_PRI_CUR CURSOR FOR 
        SELECT DISTINCT 
            CONCAT(business_entity, ' - ', nature, ' - ', status) AS CODPRIMROL, 
            CONCAT(business_entity, ' - ', nature, ' - ', status) AS NAMPRIMROL, 
            0 AS ACTIONCODE  -- Default ActionCode (Modify if needed)
        FROM dbo."T_Maestro_DB";  

BEGIN
    -- Start transaction
    OpenedTran := TRUE;

    -- Update flag to 'N' before inserting new records
    UPDATE dbo."TPRIMROLDB" SET "FLAG" = 'N';

    -- Open cursor
    OPEN WK_PRI_CUR;
    FETCH WK_PRI_CUR INTO CODPRIMROL, NAMPRIMROL, ACTIONCODE;

    -- Process each row
    WHILE FOUND LOOP
        -- Check if CODPRIMROL already exists
        IF EXISTS (SELECT 1 FROM dbo."TPRIMROLDB" WHERE "CODPRIMROL" = CODPRIMROL) THEN
            -- Update existing record
            UPDATE dbo."TPRIMROLDB" 
            SET "FLAG" = 'Y', "NAMPRIMROL" = NAMPRIMROL, "ACTIONCODE" = ACTIONCODE
            WHERE "CODPRIMROL" = CODPRIMROL;
        ELSE
            -- Insert new record
            INSERT INTO dbo."TPRIMROLDB"("FLAG", "CODPRIMROL", "NAMPRIMROL", "ACTIONCODE")
            VALUES ('Y', CODPRIMROL, NAMPRIMROL, ACTIONCODE);
        END IF;

        -- Fetch next record
        FETCH WK_PRI_CUR INTO CODPRIMROL, NAMPRIMROL, ACTIONCODE;
    END LOOP;

    -- Close cursor
    CLOSE WK_PRI_CUR;

    RETURN;
END;
$function$;